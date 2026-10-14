import { describe, expect, it, vi } from "vitest";
import { COMPLETION_URL, rechercherVilles } from "../src/geoplateforme";

const reponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("rechercherVilles", () => {
  it("n'appelle pas le service pour moins de 3 caractères", async () => {
    const fetchFn = vi.fn();
    expect(await rechercherVilles("ma", { fetchFn })).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("interroge l'autocomplétion des communes et convertit les résultats", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      reponse({
        status: "OK",
        results: [
          { x: 5.366701, y: 43.273247, names: ["Marseille"], fulltext: "Marseille" },
          {
            x: 3.531289, y: 43.359669, names: ["Marseillan"],
            fulltext: "Marseillan, 34340", zipcode: "34340",
          },
        ],
      }),
    );

    const villes = await rechercherVilles(" marseil ", { fetchFn });

    const url = new URL(fetchFn.mock.calls[0][0]);
    expect(`${url.origin}${url.pathname}`).toBe(COMPLETION_URL);
    expect(url.searchParams.get("text")).toBe("marseil");
    expect(url.searchParams.get("type")).toBe("PositionOfInterest");
    expect(url.searchParams.get("poiType")).toBe("commune");
    expect(villes).toEqual([
      { nom: "Marseille", libelle: "Marseille", codePostal: undefined, lon: 5.366701, lat: 43.273247 },
      { nom: "Marseillan", libelle: "Marseillan, 34340", codePostal: "34340", lon: 3.531289, lat: 43.359669 },
    ]);
  });

  it("lève une erreur si le service répond en erreur", async () => {
    const fetchFn = vi.fn().mockResolvedValue(reponse({}, 500));
    await expect(rechercherVilles("paris", { fetchFn })).rejects.toThrow("HTTP 500");
  });
});

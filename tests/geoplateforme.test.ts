import { describe, expect, it, vi } from "vitest";
import { COMPLETION_URL, rechercherCommunes } from "../src/geoplateforme";

function fetchSimule(corps: unknown, status = 200) {
  return vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
    new Response(JSON.stringify(corps), { status }),
  );
}

const reponseMarseille = {
  status: "OK",
  results: [
    {
      x: 5.3698,
      y: 43.2965,
      names: ["Marseille"],
      fulltext: "Marseille, 13000",
      zipcode: "13000",
    },
  ],
};

const urlAppelee = (f: ReturnType<typeof fetchSimule>) => new URL(String(f.mock.calls[0][0]));

// specs/001-city-distance/spec.md
describe("US1 - recherche de communes", () => {
  it("FR-002 : interroge le service sur les communes et convertit la réponse", async () => {
    const f = fetchSimule(reponseMarseille);
    const communes = await rechercherCommunes("Marseil", { fetchFn: f });

    const url = urlAppelee(f);
    expect(url.origin + url.pathname).toBe(COMPLETION_URL);
    expect(url.searchParams.get("text")).toBe("Marseil");
    expect(url.searchParams.get("type")).toBe("PositionOfInterest");
    expect(url.searchParams.get("poiType")).toBe("commune");
    expect(communes).toEqual([
      { nom: "Marseille", libelle: "Marseille, 13000", codePostal: "13000", lon: 5.3698, lat: 43.2965 },
    ]);
  });

  it("réponse vide ou sans résultats : liste vide", async () => {
    expect(await rechercherCommunes("Xyzw", { fetchFn: fetchSimule({ status: "OK", results: [] }) })).toEqual([]);
    expect(await rechercherCommunes("Xyzw", { fetchFn: fetchSimule({ status: "OK" }) })).toEqual([]);
  });

  it("moins de 3 caractères : aucune requête", async () => {
    const f = fetchSimule(reponseMarseille);
    expect(await rechercherCommunes("Pa", { fetchFn: f })).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });

  it("espaces de début et de fin retirés", async () => {
    const f = fetchSimule(reponseMarseille);
    await rechercherCommunes("   Lyon  ", { fetchFn: f });
    expect(urlAppelee(f).searchParams.get("text")).toBe("Lyon");
  });

  it("FR-003 : 10 résultats au plus par défaut", async () => {
    const f = fetchSimule(reponseMarseille);
    await rechercherCommunes("Lyon", { fetchFn: f });
    expect(urlAppelee(f).searchParams.get("maximumResponses")).toBe("10");
  });
});

describe("US3 - erreurs et recherches obsolètes", () => {
  it("FR-011 : HTTP 500 → erreur explicite", async () => {
    await expect(rechercherCommunes("Lyon", { fetchFn: fetchSimule({}, 500) })).rejects.toThrow("500");
  });

  it("FR-010 : le signal d'annulation est transmis à fetch", async () => {
    const f = fetchSimule(reponseMarseille);
    const controleur = new AbortController();
    await rechercherCommunes("Borde", { fetchFn: f, signal: controleur.signal });
    expect(f.mock.calls[0][1]?.signal).toBe(controleur.signal);
  });
});

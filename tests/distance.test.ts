import { describe, expect, it } from "vitest";
import { haversine } from "../src/distance";

describe("haversine", () => {
  it("renvoie 0 pour deux points identiques", () => {
    expect(haversine({ lon: 2.35, lat: 48.85 }, { lon: 2.35, lat: 48.85 })).toBe(0);
  });

  it("calcule la distance Paris - Marseille (~661 km)", () => {
    const paris = { lon: 2.3522, lat: 48.8566 };
    const marseille = { lon: 5.3698, lat: 43.2965 };
    expect(haversine(paris, marseille)).toBeCloseTo(661, -1);
  });

  it("est symétrique", () => {
    const a = { lon: -1.55, lat: 47.22 };
    const b = { lon: 7.75, lat: 48.58 };
    expect(haversine(a, b)).toBeCloseTo(haversine(b, a), 9);
  });
});

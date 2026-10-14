import { describe, expect, it } from "vitest";
import { formaterDistance, haversine } from "../src/distance";

const paris = { lon: 2.3522, lat: 48.8566 };
const marseille = { lon: 5.3698, lat: 43.2965 };

// specs/001-city-distance/spec.md — User Story 1
describe("US1 - FR-006 distance à vol d'oiseau", () => {
  it("points identiques : 0 km", () => {
    expect(haversine(paris, paris)).toBe(0);
  });

  it("SC-003 : Paris – Marseille à 1 km de 660 km", () => {
    expect(Math.abs(haversine(paris, marseille) - 660)).toBeLessThan(1);
  });

  it("symétrie", () => {
    expect(haversine(paris, marseille)).toBe(haversine(marseille, paris));
  });
});

describe("US1 - FR-008 format d'affichage", () => {
  it("≥ 10 km : kilomètres entiers", () => {
    expect(formaterDistance(haversine(paris, marseille))).toBe("660 km");
  });

  it("< 1 km : mètres", () => {
    expect(formaterDistance(0.4321)).toBe("432 m");
    expect(formaterDistance(0)).toBe("0 m");
  });

  it("< 10 km : une décimale", () => {
    expect(formaterDistance(7.26)).toBe("7,3 km");
  });

  it("séparateur de milliers français", () => {
    expect(formaterDistance(1234.4).replace(/\s/gu, " ")).toBe("1 234 km");
  });
});

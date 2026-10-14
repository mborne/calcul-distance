import { describe, expect, it } from "vitest";
import { formaterDistance, haversine } from "../src/distance";

const paris = { lon: 2.3522, lat: 48.8566 };
const marseille = { lon: 5.3698, lat: 43.2965 };

// Spec : openspec/specs/distance-calculation/spec.md
describe("distance-calculation / Great-circle distance", () => {
  it("Scenario: Identical points", () => {
    expect(haversine(paris, paris)).toBe(0);
  });

  it("Scenario: Paris to Marseille", () => {
    expect(Math.abs(haversine(paris, marseille) - 660)).toBeLessThan(1);
  });

  it("Scenario: Symmetry", () => {
    expect(haversine(paris, marseille)).toBe(haversine(marseille, paris));
  });
});

describe("distance-calculation / Display format", () => {
  it("Scenario: Long distance", () => {
    expect(formaterDistance(haversine(paris, marseille))).toBe("660 km");
  });

  it("Scenario: Short distance", () => {
    expect(formaterDistance(0.4321)).toBe("432 m");
  });

  it("Scenario: Medium distance", () => {
    expect(formaterDistance(7.26)).toBe("7,3 km");
  });

  it("utilise le séparateur de milliers français", () => {
    expect(formaterDistance(1234.4).replace(/\s/gu, " ")).toBe("1 234 km");
  });
});

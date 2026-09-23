import { describe, expect, it } from "vitest";
import { dropRates, pityRules } from "./dropRates";

describe("dropRates", () => {
  it("formats every tier from the rarity table", () => {
    const rates = dropRates();
    expect(rates.map(({ chance }) => chance)).toEqual([
      "0.05%",
      "0.25%",
      "1.2%",
      "4.5%",
      "12%",
      "27%",
      "55%",
    ]);
    expect(rates[0]).toMatchObject({ label: "Galaxy Opal", oneIn: "1 in 2,000", emojis: 1 });
    expect(rates.at(-1)).toMatchObject({ label: "Common", oneIn: "1 in 1.8" });
  });
});

describe("pityRules", () => {
  it("lists the guarantees, most frequent first", () => {
    expect(pityRules()).toEqual([
      "Epic or better is guaranteed at least once every 30 drops",
      "Legendary or better is guaranteed at least once every 150 drops",
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { EMOJIS_BY_RARITY } from "./emojis";
import { RARITIES, TOTAL_WEIGHT } from "./rarity";
import { MAX_PUSHES_PER_DROP, rollEmoji, rollPushesNeeded, rollRarity } from "./roll";

/** An RNG that returns the given values in order, then repeats the last one. */
const sequence =
  (...values: number[]) =>
  () =>
    values.length > 1 ? (values.shift() ?? 0) : (values[0] ?? 0);

describe("rollRarity", () => {
  it("maps each weight band to its rarity", () => {
    let start = 0;
    for (const { id, weight } of RARITIES) {
      expect(rollRarity(() => start / TOTAL_WEIGHT)).toBe(id);
      expect(rollRarity(() => (start + weight - 0.001) / TOTAL_WEIGHT)).toBe(id);
      start += weight;
    }
  });

  it("returns common for the highest possible roll", () => {
    expect(rollRarity(() => 0.999_999)).toBe("common");
  });
});

describe("rollEmoji", () => {
  it("picks from the rolled rarity", () => {
    expect(rollEmoji(undefined, sequence(0, 0))).toBe(EMOJIS_BY_RARITY.galaxyOpal[0]);
  });

  it("never returns the excluded emoji", () => {
    // First roll lands on 💩 (excluded), the second on the first legendary emoji.
    const rng = sequence(0, 0, 1 / TOTAL_WEIGHT, 0);
    expect(rollEmoji("💩", rng)).toBe(EMOJIS_BY_RARITY.legendary[0]);
  });
});

describe("rollPushesNeeded", () => {
  it("stays within 1..MAX_PUSHES_PER_DROP", () => {
    expect(rollPushesNeeded(() => 0)).toBe(1);
    expect(rollPushesNeeded(() => 0.999_999)).toBe(MAX_PUSHES_PER_DROP);
  });
});

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

  it("never goes below the floor", () => {
    expect(rollRarity(() => 0.999_999, "epic")).toBe("epic");
    expect(rollRarity(() => 0.999_999, "legendary")).toBe("legendary");
    expect(rollRarity(() => 0, "epic")).toBe("galaxyOpal");
  });

  it("keeps relative odds above the floor", () => {
    // Epic floor: 600 basis points in play, Epic takes the top 450 of them.
    expect(rollRarity(() => 149.9 / 600, "epic")).toBe("legendary");
    expect(rollRarity(() => 150 / 600, "epic")).toBe("epic");
  });
});

describe("rollEmoji", () => {
  it("picks from the rolled rarity", () => {
    expect(rollEmoji({}, sequence(0, 0))).toBe(EMOJIS_BY_RARITY.galaxyOpal[0]);
  });

  it("rerolls the rarity when the excluded emoji is the only one in its tier", () => {
    // The first rarity roll lands on Galaxy Opal (only 💩, excluded), the second on Mythic.
    const rng = sequence(0, RARITIES[0].weight / TOTAL_WEIGHT, 0);
    expect(rollEmoji({ exclude: "💩" }, rng)).toBe(EMOJIS_BY_RARITY.mythic[0]);
  });

  it("leaves the excluded emoji out of its tier without rerolling the rarity", () => {
    const [first, second] = EMOJIS_BY_RARITY.common;
    expect(rollEmoji({ exclude: first }, sequence(0.999_999, 0))).toBe(second);
  });
});

describe("rollPushesNeeded", () => {
  it("stays within 1..MAX_PUSHES_PER_DROP", () => {
    expect(rollPushesNeeded(() => 0)).toBe(1);
    expect(rollPushesNeeded(() => 0.999_999)).toBe(MAX_PUSHES_PER_DROP);
  });
});

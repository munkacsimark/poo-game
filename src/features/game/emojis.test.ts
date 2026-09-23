import { describe, expect, it } from "vitest";
import { EMOJIS_BY_RARITY, getRarity, isEmoji } from "./emojis";
import { RARITIES, TOTAL_WEIGHT } from "./rarity";

describe("emojis", () => {
  it("lists every emoji exactly once", () => {
    const all = RARITIES.flatMap(({ id }) => EMOJIS_BY_RARITY[id]);
    expect(new Set(all).size).toBe(all.length);
  });

  it("has at least one emoji per rarity", () => {
    for (const { id } of RARITIES) expect(EMOJIS_BY_RARITY[id].length).toBeGreaterThan(0);
  });

  it("keeps all 298 emojis so no save loses progress", () => {
    expect(RARITIES.flatMap(({ id }) => EMOJIS_BY_RARITY[id])).toHaveLength(298);
  });

  it("makes each emoji rarer than every emoji of a more common tier", () => {
    const perEmoji = RARITIES.map(({ id, weight }) => weight / EMOJIS_BY_RARITY[id].length);
    expect(perEmoji).toEqual(perEmoji.toSorted((a, b) => a - b));
    expect(new Set(perEmoji).size).toBe(perEmoji.length);
  });

  it("uses basis-point weights that sum to 100 %", () => {
    expect(TOTAL_WEIGHT).toBe(10_000);
  });

  it("looks up rarity", () => {
    expect(getRarity("💩")).toBe("galaxyOpal");
    expect(getRarity("🦄")).toBe("mythic");
    expect(getRarity("👑")).toBe("legendary");
    expect(getRarity("🍟")).toBe("common");
  });

  it("validates unknown values", () => {
    expect(isEmoji("🦄")).toBe(true);
    expect(isEmoji("nope")).toBe(false);
    expect(isEmoji(42)).toBe(false);
  });
});

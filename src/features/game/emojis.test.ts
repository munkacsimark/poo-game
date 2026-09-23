import { describe, expect, it } from "vitest";
import { EMOJIS_BY_RARITY, getRarity, isEmoji } from "./emojis";
import { RARITIES } from "./rarity";

describe("emojis", () => {
  it("lists every emoji exactly once", () => {
    const all = RARITIES.flatMap(({ id }) => EMOJIS_BY_RARITY[id]);
    expect(new Set(all).size).toBe(all.length);
  });

  it("has at least one emoji per rarity", () => {
    for (const { id } of RARITIES) expect(EMOJIS_BY_RARITY[id].length).toBeGreaterThan(0);
  });

  it("looks up rarity", () => {
    expect(getRarity("💩")).toBe("galaxyOpal");
    expect(getRarity("🦄")).toBe("legendary");
    expect(getRarity("🍟")).toBe("common");
  });

  it("validates unknown values", () => {
    expect(isEmoji("🦄")).toBe(true);
    expect(isEmoji("nope")).toBe(false);
    expect(isEmoji(42)).toBe(false);
  });
});

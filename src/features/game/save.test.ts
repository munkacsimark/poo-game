import { describe, expect, it } from "vitest";
import { getRarity } from "./emojis";
import { createStarterSave, parseSaveData } from "./save";

describe("parseSaveData", () => {
  it("accepts a valid save", () => {
    const save = {
      selected: "🦄",
      clicks: 3,
      collection: { "🦄": 2 },
      pity: { legendary: 40, epic: 7 },
    } as const;
    expect(parseSaveData(save)).toEqual(save);
  });

  it("drops unknown emojis and invalid counts", () => {
    expect(
      parseSaveData({
        selected: "🦄",
        clicks: -4,
        collection: { "🦄": 1, bogus: 3, "🍟": 0 },
        pity: { legendary: -1, epic: "3" },
      }),
    ).toEqual({
      selected: "🦄",
      clicks: 0,
      collection: { "🦄": 1 },
      pity: { legendary: 0, epic: 0 },
    });
  });

  it("always owns the selected emoji", () => {
    expect(parseSaveData({ selected: "🦄" })?.collection).toEqual({ "🦄": 1 });
  });

  it("rejects saves without a known selected emoji", () => {
    expect(parseSaveData({ selected: "nope", collection: {} })).toBeUndefined();
    expect(parseSaveData("junk")).toBeUndefined();
  });
});

describe("createStarterSave", () => {
  it("starts with one common emoji", () => {
    const save = createStarterSave();
    expect(getRarity(save.selected)).toBe("common");
    expect(save.collection).toEqual({ [save.selected]: 1 });
    expect(save.clicks).toBe(0);
  });
});

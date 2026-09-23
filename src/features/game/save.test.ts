import { describe, expect, it } from "vitest";
import { getRarity } from "./emojis";
import { createStarterSave } from "./save";

describe("createStarterSave", () => {
  it("starts with one common emoji, found now", () => {
    const save = createStarterSave("2026-09-24T10:00:00.000Z");
    expect(getRarity(save.selected)).toBe("common");
    expect(save.collection).toEqual({
      [save.selected]: { count: 1, firstFoundAt: "2026-09-24T10:00:00.000Z" },
    });
    expect(save.clicks).toBe(0);
  });
});

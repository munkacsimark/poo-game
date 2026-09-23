import { describe, expect, it } from "vitest";
import { loadSave, writeSave } from "./save";

const legacy = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify({ value, createdDate: 0 }));

describe("save", () => {
  it("returns undefined when nothing is stored", () => {
    expect(loadSave()).toBeUndefined();
  });

  it("round-trips", () => {
    const save = { selected: "🦄", clicks: 3, collection: { "🦄": 2 } } as const;
    writeSave(save);
    expect(loadSave()).toEqual(save);
  });

  it("drops unknown emojis and invalid counts", () => {
    localStorage.setItem(
      "poo-game:save",
      JSON.stringify({
        version: 1,
        selected: "🦄",
        clicks: -4,
        collection: { "🦄": 1, bogus: 3, "🍟": 0 },
      }),
    );
    expect(loadSave()).toEqual({ selected: "🦄", clicks: 0, collection: { "🦄": 1 } });
  });

  it("ignores corrupt data", () => {
    localStorage.setItem("poo-game:save", "{not json");
    expect(loadSave()).toBeUndefined();
  });

  it("migrates the legacy local-data-storage keys", () => {
    legacy("collected_emojis", [
      { emoji: "🍟", pcs: 3 },
      { emoji: "🦄", pcs: 1 },
    ]);
    legacy("last_emoji", "🦄");
    legacy("clicks", 42);

    const expected = { selected: "🦄", clicks: 42, collection: { "🍟": 3, "🦄": 1 } };
    expect(loadSave()).toEqual(expected);
    expect(localStorage.getItem("collected_emojis")).toBeNull();
    expect(localStorage.getItem("clicks")).toBeNull();
    // The migrated save is now read from the new key.
    expect(loadSave()).toEqual(expected);
  });

  it("adds the legacy last emoji to the collection if it was never saved there", () => {
    legacy("last_emoji", "🦄");
    expect(loadSave()).toEqual({ selected: "🦄", clicks: 0, collection: { "🦄": 1 } });
  });
});

import { describe, expect, it } from "vitest";
import { loadSave, writeSave } from "./save";

describe("save", () => {
  it("returns undefined when nothing is stored", () => {
    expect(loadSave()).toBeUndefined();
  });

  it("round-trips", () => {
    const save = {
      selected: "🦄",
      clicks: 3,
      collection: { "🦄": 2 },
      pity: { legendary: 40, epic: 7 },
    } as const;
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
        pity: { legendary: -1, epic: "3" },
      }),
    );
    expect(loadSave()).toEqual({
      selected: "🦄",
      clicks: 0,
      collection: { "🦄": 1 },
      pity: { legendary: 0, epic: 0 },
    });
  });

  it("ignores unknown versions", () => {
    localStorage.setItem(
      "poo-game:save",
      JSON.stringify({ version: 99, selected: "🦄", clicks: 5, collection: {} }),
    );
    expect(loadSave()).toBeUndefined();
  });

  it("ignores corrupt data", () => {
    localStorage.setItem("poo-game:save", "{not json");
    expect(loadSave()).toBeUndefined();
  });
});

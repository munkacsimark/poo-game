import { describe, expect, it } from "vitest";
import type { SaveData } from "../game/save";
import type { ProfilesState } from "./profiles";
import { loadProfiles, parseProfile, writeProfiles } from "./storage";

const save: SaveData = {
  selected: "🦄",
  clicks: 3,
  collection: { "🦄": 2 },
  pity: { legendary: 1, epic: 1 },
};
const stored = (value: unknown) => localStorage.setItem("poo-game:profiles", JSON.stringify(value));

describe("profile storage", () => {
  it("creates a single starter profile on first run", () => {
    const { activeId, profiles } = loadProfiles();
    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({ id: activeId, name: "Player 1" });
    expect(profiles[0]?.save.clicks).toBe(0);
  });

  it("round-trips", () => {
    const state: ProfilesState = {
      activeId: "b",
      profiles: [
        { id: "a", name: "Ann", avatar: "🐱", save },
        { id: "b", name: "Bo", avatar: "🤖", save },
      ],
    };
    writeProfiles(state);
    expect(loadProfiles()).toEqual(state);
  });

  it("drops invalid and duplicate profiles and repairs the active id", () => {
    stored({
      version: 1,
      activeId: "gone",
      profiles: [
        { id: "a", name: "Ann", avatar: "🐱", save },
        { id: "a", name: "Dup", avatar: "🐱", save },
        { id: "b", name: "Bad", avatar: "🐱", save: { selected: "nope" } },
        "junk",
      ],
    });
    expect(loadProfiles()).toEqual({
      activeId: "a",
      profiles: [{ id: "a", name: "Ann", avatar: "🐱", save }],
    });
  });

  it("starts fresh on unknown versions or corrupt data", () => {
    stored({ version: 99, activeId: "a", profiles: [{ id: "a", name: "Ann", save }] });
    expect(loadProfiles().profiles[0]?.name).toBe("Player 1");
    localStorage.setItem("poo-game:profiles", "{not json");
    expect(loadProfiles().profiles[0]?.name).toBe("Player 1");
  });

  it("falls back to a default avatar", () => {
    expect(parseProfile({ id: "a", name: "Ann", avatar: "💩", save })?.avatar).toBe("🐱");
  });
});

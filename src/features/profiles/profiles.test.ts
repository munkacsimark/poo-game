import { describe, expect, it } from "vitest";
import type { SaveData } from "../game/save";
import {
  cleanName,
  MAX_PROFILES,
  profilesReducer,
  uniqueName,
  type Profile,
  type ProfilesState,
} from "./profiles";

const save: SaveData = {
  selected: "🍟",
  clicks: 0,
  collection: { "🍟": { count: 1, firstFoundAt: "2026-01-01T00:00:00.000Z" } },
  pity: { legendary: 0, epic: 0 },
};
const profile = (id: string, name = id): Profile => ({
  id,
  name,
  avatar: "🐱",
  createdAt: "2026-01-01T00:00:00.000Z",
  save,
});
const state: ProfilesState = { activeId: "a", profiles: [profile("a", "Ann"), profile("b", "Bo")] };

describe("cleanName", () => {
  it("trims, collapses spaces and limits the length", () => {
    expect(cleanName("  Ann   Lee ")).toBe("Ann Lee");
    expect(cleanName("x".repeat(40))).toHaveLength(20);
    expect(cleanName("   ")).toBe("Player");
  });
});

describe("uniqueName", () => {
  it("numbers names that are already taken, ignoring case", () => {
    expect(uniqueName("Cy", state.profiles)).toBe("Cy");
    expect(uniqueName("ann", state.profiles)).toBe("ann 2");
    expect(uniqueName("Ann", [...state.profiles, profile("c", "Ann 2")])).toBe("Ann 3");
  });
});

describe("profilesReducer", () => {
  it("adds profiles with unique names, up to the limit", () => {
    const added = profilesReducer(state, { type: "add", profile: profile("c", "Ann") });
    expect(added.profiles.map(({ name }) => name)).toEqual(["Ann", "Bo", "Ann 2"]);
    expect(added.activeId).toBe("a");

    const full = {
      ...state,
      profiles: Array.from({ length: MAX_PROFILES }, (_, i) => profile(String(i))),
    };
    expect(profilesReducer(full, { type: "add", profile: profile("x") })).toBe(full);
  });

  it("edits a profile's name and avatar", () => {
    const edited = profilesReducer(state, { type: "edit", id: "b", name: " Ann ", avatar: "🤖" });
    expect(edited.profiles[1]).toMatchObject({ name: "Ann 2", avatar: "🤖" });
    const same = profilesReducer(state, { type: "edit", id: "a", name: "Ann", avatar: "🐱" });
    expect(same.profiles[0]?.name).toBe("Ann");
  });

  it("switches only to existing profiles", () => {
    expect(profilesReducer(state, { type: "switch", id: "b" }).activeId).toBe("b");
    expect(profilesReducer(state, { type: "switch", id: "nope" })).toBe(state);
  });

  it("removes profiles, moving the active one, but never the last", () => {
    const removed = profilesReducer(state, { type: "remove", id: "a" });
    expect(removed).toEqual({ activeId: "b", profiles: [profile("b", "Bo")] });
    expect(profilesReducer(removed, { type: "remove", id: "b" })).toBe(removed);
  });

  it("stores a profile's progress", () => {
    const next = { ...save, clicks: 9 };
    const saved = profilesReducer(state, { type: "save", id: "b", save: next });
    expect(saved.profiles[1]?.save).toBe(next);
    expect(saved.profiles[0]?.save).toBe(save);
  });
});

import { describe, expect, it } from "vitest";
import { sealValue } from "../../shared/lib/sealedStorage";
import { flipBase64Char } from "../../test/flipBase64Char";
import { owned, T0 } from "../../test/profileStorage";
import type { ProfilesState } from "./profiles";
import { SAVE_FORMAT, SAVE_VERSION } from "./schema";
import { clearSavedData, loadProfiles, writeProfiles } from "./storage";

const state: ProfilesState = {
  activeId: "b",
  profiles: [
    {
      id: "a",
      name: "Ann",
      avatar: "🐱",
      createdAt: T0,
      save: {
        selected: "🦄",
        clicks: 3,
        collection: owned({ "🦄": 2 }),
        pity: { legendary: 1, epic: 1 },
      },
    },
    {
      id: "b",
      name: "Bo",
      avatar: "🤖",
      createdAt: T0,
      save: {
        selected: "🍟",
        clicks: 0,
        collection: owned({ "🍟": 1 }),
        pity: { legendary: 0, epic: 0 },
      },
    },
  ],
};

const raw = () => localStorage.getItem("poo-game:profiles") ?? "";
const storeSealed = (document: unknown) =>
  localStorage.setItem("poo-game:profiles", sealValue(document));

describe("profile storage", () => {
  it("creates a single starter profile on first run", () => {
    const loaded = loadProfiles();
    expect(loaded.status).toBe("ok");
    if (loaded.status !== "ok") return;
    expect(loaded.state.profiles).toHaveLength(1);
    expect(loaded.state.profiles[0]).toMatchObject({ name: "Player 1" });
  });

  it("round-trips, sealed", () => {
    writeProfiles(state);
    expect(raw()).toMatch(/^PGS1/);
    expect(raw()).not.toContain("Ann");
    expect(loadProfiles()).toMatchObject({ status: "ok", state });
  });

  it("reports v0.1.1 data as outdated, plain or sealed", () => {
    const v1 = { version: 1, activeId: "a", profiles: [] };
    localStorage.setItem("poo-game:profiles", JSON.stringify(v1));
    expect(loadProfiles()).toEqual({ status: "error", reason: "outdated" });
    storeSealed(v1);
    expect(loadProfiles()).toEqual({ status: "error", reason: "outdated" });
  });

  it("reports data from a newer version", () => {
    storeSealed({ format: SAVE_FORMAT, version: SAVE_VERSION + 1 });
    expect(loadProfiles()).toEqual({ status: "error", reason: "newer" });
  });

  it("reports edited or invalid data as damaged", () => {
    writeProfiles(state);
    localStorage.setItem("poo-game:profiles", flipBase64Char(raw(), raw().length - 1));
    expect(loadProfiles()).toEqual({ status: "error", reason: "damaged" });

    storeSealed({ format: SAVE_FORMAT, version: SAVE_VERSION, profiles: "nope" });
    expect(loadProfiles()).toEqual({ status: "error", reason: "damaged" });

    // Hand-typed plain JSON in the current format isn't accepted either.
    localStorage.setItem("poo-game:profiles", JSON.stringify({ format: SAVE_FORMAT, version: 2 }));
    expect(loadProfiles()).toEqual({ status: "error", reason: "damaged" });
  });

  it("clears saved data but keeps the sound setting", () => {
    writeProfiles(state);
    localStorage.setItem("poo-game:sealed", "1");
    localStorage.setItem("poo-game:muted", "true");
    clearSavedData();
    expect(localStorage.getItem("poo-game:profiles")).toBeNull();
    expect(localStorage.getItem("poo-game:sealed")).toBeNull();
    expect(localStorage.getItem("poo-game:muted")).toBe("true");
  });
});

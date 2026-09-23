import { describe, expect, it } from "vitest";
import { migrate } from "./migrations";
import { fromSaveFile, readDocument, toSaveFile } from "./saveFile";
import { SAVE_FORMAT, SaveFileSchema } from "./schema";

/**
 * A real version-2 save, pinned. Never edit it: when SAVE_VERSION moves on, it must still load
 * through MIGRATIONS. Add a new fixture for each new version instead.
 */
const V2_FIXTURE = {
  format: "poo-game/save",
  version: 2,
  updatedAt: "2026-09-24T08:00:00.000Z",
  appVersion: "0.1.2",
  activeProfileId: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  profiles: [
    {
      id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      name: "Mark",
      avatar: "fox",
      createdAt: "2026-09-20T12:00:00.000Z",
      progress: {
        selected: "unicorn",
        taps: 420,
        collection: {
          unicorn: { count: 2, firstFoundAt: "2026-09-21T09:30:00.000Z" },
          "french-fries": { count: 7, firstFoundAt: "2026-09-20T12:00:00.000Z" },
        },
        pity: { sinceEpic: 3, sinceLegendary: 40 },
      },
    },
  ],
};

const read = (value: unknown) => readDocument(value, SAVE_FORMAT, SaveFileSchema);

describe("save file", () => {
  it("reads the pinned v2 fixture into game state", () => {
    const result = read(V2_FIXTURE);
    if (!result.ok) throw new Error(result.error);
    const [mark] = fromSaveFile(result.document).profiles;
    expect(mark).toEqual({
      id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      name: "Mark",
      avatar: "🦊",
      createdAt: "2026-09-20T12:00:00.000Z",
      save: {
        selected: "🦄",
        clicks: 420,
        collection: {
          "🦄": { count: 2, firstFoundAt: "2026-09-21T09:30:00.000Z" },
          "🍟": { count: 7, firstFoundAt: "2026-09-20T12:00:00.000Z" },
        },
        pity: { epic: 3, legendary: 40 },
      },
    });
  });

  it("writes what it reads (apart from the update time)", () => {
    const result = read(V2_FIXTURE);
    if (!result.ok) throw new Error(result.error);
    const written = toSaveFile(fromSaveFile(result.document));
    expect(written).toEqual({
      ...V2_FIXTURE,
      updatedAt: expect.any(String),
      appVersion: expect.any(String),
    });
  });

  it("keeps fields and emojis from a newer version through a load and save", () => {
    const [profile] = V2_FIXTURE.profiles;
    const fromTheFuture = {
      ...V2_FIXTURE,
      theme: "dark",
      profiles: [
        {
          ...profile,
          badges: ["first-drop"],
          progress: {
            ...profile?.progress,
            collection: {
              ...profile?.progress.collection,
              "brand-new-emoji": {
                count: 1,
                firstFoundAt: "2027-01-01T00:00:00.000Z",
                shiny: true,
              },
            },
          },
        },
      ],
    };
    const result = read(fromTheFuture);
    if (!result.ok) throw new Error(result.error);
    const state = fromSaveFile(result.document);
    expect(Object.keys(state.profiles[0]?.save.collection ?? {})).toEqual(["🦄", "🍟"]);

    const written = toSaveFile(state, result.document);
    expect(written).toMatchObject({
      theme: "dark",
      profiles: [
        {
          badges: ["first-drop"],
          progress: {
            collection: {
              "brand-new-emoji": { count: 1, shiny: true },
              unicorn: { count: 2 },
            },
          },
        },
      ],
    });
  });

  it("drops profiles that were deleted, even when merging", () => {
    const result = read(V2_FIXTURE);
    if (!result.ok) throw new Error(result.error);
    const written = toSaveFile({ activeId: "other", profiles: [] }, result.document);
    expect(written).toMatchObject({ profiles: [] });
  });

  it("shows another owned emoji when the selected one is unknown", () => {
    const [profile] = V2_FIXTURE.profiles;
    const result = read({
      ...V2_FIXTURE,
      profiles: [{ ...profile, progress: { ...profile?.progress, selected: "brand-new-emoji" } }],
    });
    if (!result.ok) throw new Error(result.error);
    expect(fromSaveFile(result.document).profiles[0]?.save.selected).toBe("🦄");
  });

  it("classifies unusable documents", () => {
    expect(read({ version: 1, profiles: [] })).toEqual({ ok: false, error: "outdated" });
    expect(read({ ...V2_FIXTURE, version: 3 })).toEqual({ ok: false, error: "newer" });
    expect(read({ ...V2_FIXTURE, format: "something-else" })).toEqual({
      ok: false,
      error: "damaged",
    });
    expect(read({ ...V2_FIXTURE, profiles: [] })).toEqual({ ok: false, error: "damaged" });
    expect(read("junk")).toEqual({ ok: false, error: "damaged" });
  });
});

describe("migrate", () => {
  it("runs each step in order and stamps the version", () => {
    const migrations = {
      2: (document: Record<string, unknown>) => ({ ...document, renamed: document.old }),
      3: (document: Record<string, unknown>) => ({ ...document, added: true }),
    };
    expect(migrate({ version: 2, old: "x" }, 2, 4, migrations)).toEqual({
      version: 4,
      old: "x",
      renamed: "x",
      added: true,
    });
  });

  it("fails when a step is missing", () => {
    expect(() => migrate({ version: 2 }, 2, 3, {})).toThrow("No migration from version 2");
  });
});

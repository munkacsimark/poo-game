import { isSealed, openValue, sealValue } from "../../shared/lib/sealedStorage";
import { readText, removeKeys, writeText } from "../../shared/lib/storage";
import { createProfile, type ProfilesState } from "./profiles";
import { fromSaveFile, readDocument, toSaveFile, type ReadError } from "./saveFile";
import { SAVE_FORMAT, SaveFileSchema } from "./schema";

/** The sealed save file (see schema.ts for its shape, sealedStorage.ts for the sealing). */
const SAVE_KEY = "poo-game:profiles";
/** Written by v0.1.1's sealing migration; unused now, removed with the rest of the data. */
const LEGACY_KEYS = ["poo-game:sealed"];

export type LoadResult =
  | {
      status: "ok";
      state: ProfilesState;
      /** The document as loaded, so writes keep fields and emojis this version doesn't know. */
      base?: unknown;
    }
  | { status: "error"; reason: ReadError };

const firstRun = (): LoadResult => {
  const profile = createProfile("Player 1");
  return { status: "ok", state: { activeId: profile.id, profiles: [profile] } };
};

/** Reads the raw stored value: sealed data, or v0.1.1's plain JSON (reported as outdated). */
const readStored = (text: string): { value: unknown } | { error: ReadError } => {
  if (isSealed(text)) {
    const value = openValue(text);
    return value === undefined ? { error: "damaged" } : { value };
  }
  try {
    const value: unknown = JSON.parse(text);
    // v0.1.1 stored plain JSON without a `format`; plain JSON with one was typed in by hand.
    return typeof value === "object" && value !== null && !("format" in value)
      ? { error: "outdated" }
      : { error: "damaged" };
  } catch {
    return { error: "damaged" };
  }
};

/**
 * The stored profiles, a fresh "Player 1" on first run, or why the stored data can't be used.
 * An error is never overwritten automatically: the player chooses to remove the data.
 */
export const loadProfiles = (): LoadResult => {
  const text = readText(SAVE_KEY);
  if (text === undefined) return firstRun();

  const stored = readStored(text);
  if ("error" in stored) return { status: "error", reason: stored.error };

  const read = readDocument(stored.value, SAVE_FORMAT, SaveFileSchema);
  if (!read.ok) return { status: "error", reason: read.error };
  return { status: "ok", state: fromSaveFile(read.document), base: read.document };
};

export const writeProfiles = (state: ProfilesState, base?: unknown): void => {
  writeText(SAVE_KEY, sealValue(toSaveFile(state, base)));
};

/** Deletes all saved progress on this device (the sound setting stays). */
export const clearSavedData = (): void => {
  removeKeys(SAVE_KEY, ...LEGACY_KEYS);
};

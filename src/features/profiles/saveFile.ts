import * as v from "valibot";
import { emojiFromId, emojiId } from "../game/emojiIds";
import { isEmoji } from "../game/emojis";
import { createStarterSave, type Collection } from "../game/save";
import { checkVersion, migrate } from "./migrations";
import { AVATAR_IDS, avatarFromId, cleanName, type Profile, type ProfilesState } from "./profiles";
import {
  DocumentHeaderSchema,
  SAVE_FORMAT,
  SAVE_VERSION,
  type StoredProfile,
  type StoredSaveFile,
} from "./schema";

/** Why a stored document or file can't be used. */
export type ReadError = "outdated" | "newer" | "damaged";

type ReadResult<T> = { ok: true; document: T } | { ok: false; error: ReadError };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Validates any versioned document: header → version check → migrations → full schema. Data
 * from before v2 (it had no `format` field) is "outdated"; data from a newer app is "newer";
 * anything else that doesn't fit the schema is "damaged".
 */
export const readDocument = <TSchema extends v.GenericSchema>(
  value: unknown,
  format: string,
  schema: TSchema,
): ReadResult<v.InferOutput<TSchema>> => {
  const header = v.safeParse(DocumentHeaderSchema, value);
  if (!header.success) {
    return {
      ok: false,
      error: isPlainObject(value) && !("format" in value) ? "outdated" : "damaged",
    };
  }
  if (header.output.format !== format) return { ok: false, error: "damaged" };

  const check = checkVersion(header.output.version);
  if (check !== "current") return { ok: false, error: check };

  let migrated: unknown;
  try {
    migrated = migrate(header.output, header.output.version);
  } catch {
    return { ok: false, error: "outdated" };
  }
  const full = v.safeParse(schema, migrated);
  return full.success ? { ok: true, document: full.output } : { ok: false, error: "damaged" };
};

/**
 * Deep-merges `next` over `base`, keeping whatever `base` has that `next` doesn't mention:
 * fields and emoji ids a newer app version added survive a round trip through this one.
 * Arrays of `{ id }` objects (profiles) merge item by id; items missing from `next` are gone.
 */
const mergeKeepingUnknown = (base: unknown, next: unknown): unknown => {
  if (isPlainObject(base) && isPlainObject(next)) {
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(next)) {
      merged[key] = mergeKeepingUnknown(base[key], value);
    }
    return merged;
  }
  if (Array.isArray(base) && Array.isArray(next)) {
    return next.map((item: unknown) => {
      if (!isPlainObject(item)) return item;
      const previous = base.find(
        (candidate: unknown) => isPlainObject(candidate) && candidate.id === item.id,
      );
      return previous === undefined ? item : mergeKeepingUnknown(previous, item);
    });
  }
  return next;
};

export const toStoredProfile = ({ id, name, avatar, createdAt, save }: Profile): StoredProfile => {
  const collection: StoredProfile["progress"]["collection"] = {};
  for (const [emoji, owned] of Object.entries(save.collection)) {
    if (isEmoji(emoji) && owned) {
      collection[emojiId(emoji)] = { count: owned.count, firstFoundAt: owned.firstFoundAt };
    }
  }
  return {
    id,
    name,
    avatar: AVATAR_IDS[avatar],
    createdAt,
    progress: {
      selected: emojiId(save.selected),
      taps: save.clicks,
      collection,
      pity: { sinceEpic: save.pity.epic, sinceLegendary: save.pity.legendary },
    },
  };
};

/**
 * The game's view of a stored profile. Emoji ids this version doesn't know are skipped here
 * (and kept in storage by `mergeKeepingUnknown`); if the selected emoji is unknown or not owned,
 * another owned one is shown.
 */
export const fromStoredProfile = (stored: StoredProfile): Profile => {
  const collection: Collection = {};
  for (const [id, entry] of Object.entries(stored.progress.collection)) {
    const emoji = emojiFromId(id);
    if (emoji) collection[emoji] = { count: entry.count, firstFoundAt: entry.firstFoundAt };
  }

  const wanted = emojiFromId(stored.progress.selected);
  let selected = wanted && collection[wanted] ? wanted : Object.keys(collection).find(isEmoji);
  if (!selected) {
    // Nothing this version knows about: start them off like a new player.
    const starter = createStarterSave(stored.createdAt);
    selected = starter.selected;
    Object.assign(collection, starter.collection);
  }

  return {
    id: stored.id,
    name: cleanName(stored.name),
    avatar: avatarFromId(stored.avatar),
    createdAt: stored.createdAt,
    save: {
      selected,
      clicks: stored.progress.taps,
      collection,
      pity: {
        epic: stored.progress.pity.sinceEpic,
        legendary: stored.progress.pity.sinceLegendary,
      },
    },
  };
};

/** The game state from a validated save file (duplicate profile ids keep the first). */
export const fromSaveFile = (file: StoredSaveFile): ProfilesState => {
  const profiles: Profile[] = [];
  for (const stored of file.profiles) {
    if (!profiles.some(({ id }) => id === stored.id)) profiles.push(fromStoredProfile(stored));
  }
  const active = profiles.find(({ id }) => id === file.activeProfileId) ?? profiles[0];
  // The schema guarantees at least one profile.
  if (!active) throw new Error("A save file without profiles passed validation");
  return { activeId: active.id, profiles };
};

/** The document to store for `state`, merged over what was loaded (`base`). */
export const toSaveFile = (state: ProfilesState, base?: unknown): unknown =>
  mergeKeepingUnknown(base, {
    format: SAVE_FORMAT,
    version: SAVE_VERSION,
    updatedAt: new Date().toISOString(),
    appVersion: import.meta.env.VITE_APP_VERSION,
    activeProfileId: state.activeId,
    profiles: state.profiles.map(toStoredProfile),
  } satisfies StoredSaveFile);

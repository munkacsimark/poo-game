import * as v from "valibot";
import { MAX_NAME_LENGTH, MAX_PROFILES } from "./profiles";

/*
 * The on-disk data format: the single source of truth for what the game persists (sealed in
 * localStorage) and exports (profile files). Types are inferred from these schemas.
 *
 * How to evolve it (see docs/architecture.md, "Data format"):
 *   - Additive, optional fields: just add them, no version bump. Every object is a
 *     `looseObject`, and writes merge over the previously loaded data, so an older app keeps
 *     fields and emojis it doesn't know about instead of deleting them.
 *   - Anything else (rename, removal, new meaning, new required field): bump SAVE_VERSION, add
 *     MIGRATIONS[old] in migrations.ts, and pin a fixture of the old version in the tests.
 *   - Never reuse or change emoji/avatar ids; alias them instead.
 */

/** Identifies the kind of document, so other JSON is never mistaken for a save. */
export const SAVE_FORMAT = "poo-game/save";
export const PROFILE_FILE_FORMAT = "poo-game/profile";
/** v1 was the unversioned-schema format of v0.1.1 and isn't readable any more. */
export const SAVE_VERSION = 2;

/** Stable kebab-case ids (emojis, avatars). */
const Id = v.pipe(v.string(), v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u), v.maxLength(80));
const Timestamp = v.pipe(v.string(), v.isoTimestamp());
const Tally = v.pipe(v.number(), v.integer(), v.minValue(0));

/** One collected emoji; an object (not a bare count) so it can grow new fields. */
const CollectedEmojiSchema = v.looseObject({
  count: v.pipe(v.number(), v.integer(), v.minValue(1)),
  firstFoundAt: Timestamp,
});

const ProgressSchema = v.looseObject({
  /** Emoji id shown on the stage. */
  selected: Id,
  taps: Tally,
  /** Keyed by emoji id. Ids this version doesn't know are kept, not dropped. */
  collection: v.record(Id, CollectedEmojiSchema),
  /** Drops since the last Epic-or-better / Legendary-or-better (bad-luck protection). */
  pity: v.looseObject({ sinceEpic: Tally, sinceLegendary: Tally }),
});

const ProfileSchema = v.looseObject({
  id: v.pipe(v.string(), v.minLength(1), v.maxLength(64)),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(MAX_NAME_LENGTH)),
  /** Avatar id, e.g. "fox". */
  avatar: Id,
  createdAt: Timestamp,
  progress: ProgressSchema,
});

/** What the game stores on the device. */
export const SaveFileSchema = v.looseObject({
  format: v.literal(SAVE_FORMAT),
  version: v.literal(SAVE_VERSION),
  updatedAt: Timestamp,
  /** App version that last wrote the data, for support and debugging. */
  appVersion: v.optional(v.string()),
  activeProfileId: v.string(),
  profiles: v.pipe(v.array(ProfileSchema), v.minLength(1), v.maxLength(MAX_PROFILES)),
});

/** What an exported profile file carries (inside its sealed container). */
export const ProfileFileSchema = v.looseObject({
  format: v.literal(PROFILE_FILE_FORMAT),
  version: v.literal(SAVE_VERSION),
  exportedAt: Timestamp,
  appVersion: v.optional(v.string()),
  profile: ProfileSchema,
});

/** Just enough to route a document: its kind and version, before the full validation. */
export const DocumentHeaderSchema = v.looseObject({
  format: v.string(),
  version: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

export type StoredProfile = v.InferOutput<typeof ProfileSchema>;
export type StoredSaveFile = v.InferOutput<typeof SaveFileSchema>;
export type StoredProfileFile = v.InferOutput<typeof ProfileFileSchema>;

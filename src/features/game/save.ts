import { readJson, removeKeys, writeJson } from "../../shared/lib/storage";
import { isEmoji, type Emoji } from "./emojis";

/** How many of each emoji the player owns. */
export type Collection = Partial<Record<Emoji, number>>;

export type SaveData = {
  selected: Emoji;
  clicks: number;
  collection: Collection;
};

const SAVE_KEY = "poo-game:save";
const SAVE_VERSION = 1;

/** Keys written by the pre-2026 version through `local-data-storage`. */
const LEGACY_KEYS = {
  collection: "collected_emojis",
  lastEmoji: "last_emoji",
  clicks: "clicks",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

const parseCollection = (value: unknown): Collection => {
  const collection: Collection = {};
  if (!isRecord(value)) return collection;
  for (const [emoji, count] of Object.entries(value)) {
    if (isEmoji(emoji) && isCount(count)) collection[emoji] = count;
  }
  return collection;
};

const parseSave = (value: unknown): SaveData | undefined => {
  if (!isRecord(value) || value.version !== SAVE_VERSION || !isEmoji(value.selected)) {
    return undefined;
  }
  return {
    selected: value.selected,
    clicks: isCount(value.clicks) ? value.clicks : 0,
    collection: parseCollection(value.collection),
  };
};

/** Legacy entries were wrapped as `{ value, createdDate }`. */
const readLegacyValue = (key: string): unknown => {
  const entry = readJson(key);
  return isRecord(entry) ? entry.value : undefined;
};

const migrateLegacySave = (): SaveData | undefined => {
  const legacyCollection = readLegacyValue(LEGACY_KEYS.collection);
  const lastEmoji = readLegacyValue(LEGACY_KEYS.lastEmoji);
  const clicks = readLegacyValue(LEGACY_KEYS.clicks);

  const collection: Collection = {};
  if (Array.isArray(legacyCollection)) {
    for (const item of legacyCollection) {
      if (isRecord(item) && isEmoji(item.emoji) && isCount(item.pcs)) {
        collection[item.emoji] = item.pcs;
      }
    }
  }

  const selected = isEmoji(lastEmoji) ? lastEmoji : Object.keys(collection).find(isEmoji);
  if (!selected) return undefined;

  collection[selected] ??= 1;
  return { selected, clicks: isCount(clicks) ? clicks : 0, collection };
};

export const loadSave = (): SaveData | undefined => {
  const save = parseSave(readJson(SAVE_KEY));
  if (save) return save;

  const migrated = migrateLegacySave();
  if (migrated) {
    writeSave(migrated);
    removeKeys(...Object.values(LEGACY_KEYS));
  }
  return migrated;
};

export const writeSave = (save: SaveData): void => {
  writeJson(SAVE_KEY, { version: SAVE_VERSION, ...save });
};

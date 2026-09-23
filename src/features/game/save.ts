import { isEmoji, type Emoji } from "./emojis";
import { INITIAL_PITY, type Pity } from "./pity";
import { rollCommonEmoji } from "./roll";

/** How many of each emoji the player owns. */
export type Collection = Partial<Record<Emoji, number>>;

/** One player's progress. Stored inside a profile (see features/profiles). */
export type SaveData = {
  selected: Emoji;
  clicks: number;
  collection: Collection;
  pity: Pity;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;

const parsePity = (value: unknown): Pity => {
  if (!isRecord(value)) return INITIAL_PITY;
  const { legendary, epic } = value;
  return {
    legendary: isNonNegativeInteger(legendary) ? legendary : 0,
    epic: isNonNegativeInteger(epic) ? epic : 0,
  };
};

const parseCollection = (value: unknown): Collection => {
  const collection: Collection = {};
  if (!isRecord(value)) return collection;
  for (const [emoji, count] of Object.entries(value)) {
    if (isEmoji(emoji) && isCount(count)) collection[emoji] = count;
  }
  return collection;
};

/**
 * Validates untrusted save data (storage or an imported file). Unknown emojis and invalid
 * counts are dropped; without a known selected emoji the save is rejected.
 */
export const parseSaveData = (value: unknown): SaveData | undefined => {
  if (!isRecord(value) || !isEmoji(value.selected)) return undefined;
  const collection = parseCollection(value.collection);
  collection[value.selected] ??= 1;
  return {
    selected: value.selected,
    clicks: isCount(value.clicks) ? value.clicks : 0,
    collection,
    pity: parsePity(value.pity),
  };
};

/** A new player's save: one random Common emoji. */
export const createStarterSave = (): SaveData => {
  const starter = rollCommonEmoji();
  return { selected: starter, clicks: 0, collection: { [starter]: 1 }, pity: INITIAL_PITY };
};

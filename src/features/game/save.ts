import { readJson, writeJson } from "../../shared/lib/storage";
import { isEmoji, type Emoji } from "./emojis";
import { INITIAL_PITY, type Pity } from "./pity";

/** How many of each emoji the player owns. */
export type Collection = Partial<Record<Emoji, number>>;

export type SaveData = {
  selected: Emoji;
  clicks: number;
  collection: Collection;
  pity: Pity;
};

const SAVE_KEY = "poo-game:save";
/**
 * Bump when `SaveData` changes shape, and migrate every older version in `parseSave` so players
 * never lose progress.
 */
const SAVE_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
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

const parseSave = (value: unknown): SaveData | undefined => {
  if (!isRecord(value) || value.version !== SAVE_VERSION || !isEmoji(value.selected)) {
    return undefined;
  }
  return {
    selected: value.selected,
    clicks: isCount(value.clicks) ? value.clicks : 0,
    collection: parseCollection(value.collection),
    pity: parsePity(value.pity),
  };
};

export const loadSave = (): SaveData | undefined => parseSave(readJson(SAVE_KEY));

export const writeSave = (save: SaveData): void => {
  writeJson(SAVE_KEY, { version: SAVE_VERSION, ...save });
};

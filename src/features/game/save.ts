import type { Emoji } from "./emojis";
import { INITIAL_PITY, type Pity } from "./pity";
import { rollCommonEmoji } from "./roll";

/** One emoji in a player's collection. */
type CollectedEmoji = {
  count: number;
  /** ISO timestamp of the first time it dropped (or was granted as the starter). */
  firstFoundAt: string;
};

/** What the player owns, by emoji. */
export type Collection = Partial<Record<Emoji, CollectedEmoji>>;

/**
 * One player's progress. Stored inside a profile; the on-disk shape is defined by the schema in
 * features/profiles/schema.ts.
 */
export type SaveData = {
  selected: Emoji;
  clicks: number;
  collection: Collection;
  pity: Pity;
};

/** A new player's save: one random Common emoji. */
export const createStarterSave = (now = new Date().toISOString()): SaveData => {
  const starter = rollCommonEmoji();
  return {
    selected: starter,
    clicks: 0,
    collection: { [starter]: { count: 1, firstFoundAt: now } },
    pity: INITIAL_PITY,
  };
};

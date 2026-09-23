import { EMOJIS_BY_RARITY, getRarity, isEmoji, type Emoji } from "../game/emojis";
import { RARITIES, rarityRank, type Rarity } from "../game/rarity";
import type { Collection } from "../game/save";

export type CollectionEntry = { emoji: Emoji; count: number; rarity: Rarity };

/** Rarest first, then most collected, then by code point for a stable order. */
export const sortCollection = (collection: Collection): CollectionEntry[] =>
  Object.entries(collection)
    .flatMap(([emoji, count]) =>
      isEmoji(emoji) && count ? [{ emoji, count, rarity: getRarity(emoji) }] : [],
    )
    .toSorted(
      (a, b) =>
        rarityRank(a.rarity) - rarityRank(b.rarity) ||
        b.count - a.count ||
        a.emoji.localeCompare(b.emoji),
    );

/** Distinct emojis collected vs. available per rarity, rarest first. */
export const rarityStats = (entries: CollectionEntry[]) =>
  RARITIES.map(({ id, label }) => ({
    id,
    label,
    collected: entries.filter((entry) => entry.rarity === id).length,
    total: EMOJIS_BY_RARITY[id].length,
  }));

export type RarityStat = ReturnType<typeof rarityStats>[number];

export const TOTAL_EMOJIS = RARITIES.reduce((sum, { id }) => sum + EMOJIS_BY_RARITY[id].length, 0);

/** Every drop ever received, duplicates included. */
export const totalDrops = (entries: CollectionEntry[]): number =>
  entries.reduce((sum, { count }) => sum + count, 0);

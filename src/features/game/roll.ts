import { EMOJIS_BY_RARITY, type Emoji } from "./emojis";
import { RARITIES, TOTAL_WEIGHT, type Rarity } from "./rarity";

/** Returns a float in [0, 1). Injectable so rolls are deterministic in tests. */
export type Rng = () => number;

/** Pushes needed per drop are rolled between 1 and this value. */
export const MAX_PUSHES_PER_DROP = 60;

const pick = <T>(items: readonly T[], rng: Rng): T => {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error("Cannot pick from an empty list");
  return item;
};

export const rollRarity = (rng: Rng = Math.random): Rarity => {
  let roll = rng() * TOTAL_WEIGHT;
  for (const { id, weight } of RARITIES) {
    if (roll < weight) return id;
    roll -= weight;
  }
  return "common";
};

/** Rolls a random emoji, never returning `exclude` so every drop is a visible change. */
export const rollEmoji = (exclude?: Emoji, rng: Rng = Math.random): Emoji => {
  for (;;) {
    const emoji = pick(EMOJIS_BY_RARITY[rollRarity(rng)], rng);
    if (emoji !== exclude) return emoji;
  }
};

export const rollCommonEmoji = (rng: Rng = Math.random): Emoji =>
  pick(EMOJIS_BY_RARITY.common, rng);

export const rollPushesNeeded = (rng: Rng = Math.random): number =>
  Math.floor(rng() * MAX_PUSHES_PER_DROP) + 1;

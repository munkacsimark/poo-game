import { secureRandom, type Rng } from "../../shared/lib/random";
import { EMOJIS_BY_RARITY, type Emoji } from "./emojis";
import { RARITIES, rarityRank, type Rarity } from "./rarity";

/** Pushes needed per drop are rolled between 1 and this value. */
export const MAX_PUSHES_PER_DROP = 60;

const pick = <T>(items: readonly T[], rng: Rng): T => {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error("Cannot pick from an empty list");
  return item;
};

/** Rolls a rarity by weight. With a `floor`, only that rarity or rarer can come up. */
export const rollRarity = (rng: Rng = secureRandom, floor: Rarity = "common"): Rarity => {
  const tiers = RARITIES.slice(0, rarityRank(floor) + 1);
  let roll = rng() * tiers.reduce((sum, { weight }) => sum + weight, 0);
  for (const { id, weight } of tiers) {
    if (roll < weight) return id;
    roll -= weight;
  }
  return floor;
};

type RollEmojiOptions = {
  /** Never returned, so every drop is a visible change. */
  exclude?: Emoji;
  /** Minimum rarity, from bad-luck protection (`pityFloor`). */
  floor?: Rarity;
};

/**
 * Rolls a random emoji. The excluded emoji is left out of its tier's pool rather than rerolled,
 * so tier rates stay exactly as published; the rarity is only rerolled when the tier has nothing
 * else (💩 showing).
 */
export const rollEmoji = (
  { exclude, floor }: RollEmojiOptions = {},
  rng: Rng = secureRandom,
): Emoji => {
  for (;;) {
    const pool = EMOJIS_BY_RARITY[rollRarity(rng, floor)].filter((emoji) => emoji !== exclude);
    if (pool.length > 0) return pick(pool, rng);
  }
};

export const rollCommonEmoji = (rng: Rng = secureRandom): Emoji =>
  pick(EMOJIS_BY_RARITY.common, rng);

export const rollPushesNeeded = (rng: Rng = secureRandom): number =>
  Math.floor(rng() * MAX_PUSHES_PER_DROP) + 1;

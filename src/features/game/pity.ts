import { rarityRank, type Rarity } from "./rarity";

/**
 * Bad-luck protection, rarest rule first: a player who went `within - 1` drops without `rarity`
 * or better is guaranteed that rarity or better on the next drop.
 */
export const PITY_RULES = [
  { rarity: "legendary", within: 150 },
  { rarity: "epic", within: 30 },
] as const satisfies readonly { rarity: Rarity; within: number }[];

/** Drops since the last drop of each pity rarity or better. */
export type Pity = Record<(typeof PITY_RULES)[number]["rarity"], number>;

export const INITIAL_PITY: Pity = { legendary: 0, epic: 0 };

/** The rarity the next drop is guaranteed to reach, if a pity rule has triggered. */
export const pityFloor = (pity: Pity): Rarity | undefined =>
  PITY_RULES.find(({ rarity, within }) => pity[rarity] + 1 >= within)?.rarity;

const atLeast = (dropped: Rarity, rarity: Rarity) => rarityRank(dropped) <= rarityRank(rarity);

/** Counters after a drop of `dropped` rarity. */
export const advancePity = (pity: Pity, dropped: Rarity): Pity => ({
  legendary: atLeast(dropped, "legendary") ? 0 : pity.legendary + 1,
  epic: atLeast(dropped, "epic") ? 0 : pity.epic + 1,
});

/**
 * Rarity tiers, ordered from rarest to most common.
 * `weight` is the relative drop chance (they sum to 233, a Fibonacci-ish curve).
 */
export const RARITIES = [
  { id: "galaxyOpal", label: "Galaxy Opal", weight: 1 },
  { id: "legendary", label: "Legendary", weight: 4 },
  { id: "epic", label: "Epic", weight: 8 },
  { id: "rare", label: "Rare", weight: 21 },
  { id: "uncommon", label: "Uncommon", weight: 55 },
  { id: "common", label: "Common", weight: 144 },
] as const;

export type Rarity = (typeof RARITIES)[number]["id"];

export const TOTAL_WEIGHT = RARITIES.reduce((sum, { weight }) => sum + weight, 0);

/** 0 = rarest. Used to sort by rarity. */
export const rarityRank = (rarity: Rarity): number => RARITIES.findIndex(({ id }) => id === rarity);

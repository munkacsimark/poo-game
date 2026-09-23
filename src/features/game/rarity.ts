/**
 * Rarity tiers, ordered from rarest to most common.
 *
 * `weight` is the tier's drop chance in basis points (1/100 of a percent), so the weights sum to
 * 10,000 and read directly as published rates: 5 = 0.05 %. Tier sizes in `EMOJIS_BY_RARITY` are
 * chosen so each single emoji is also rarer than every single emoji of a more common tier (a unit
 * test enforces this). `theme` says which emojis belong in the tier.
 */
export const RARITIES = [
  {
    id: "galaxyOpal",
    label: "Galaxy Opal",
    weight: 5,
    theme: "The one and only 💩",
  },
  {
    id: "mythic",
    label: "Mythic",
    weight: 25,
    theme: "Myths and the cosmos: unicorns, dragons, planets and aliens",
  },
  {
    id: "legendary",
    label: "Legendary",
    weight: 120,
    theme: "Royalty and treasure: crowns, jewels, trophies and prizes",
  },
  {
    id: "epic",
    label: "Epic",
    weight: 450,
    theme: "Legends and the unknown: monsters, spirits, relics, robots and space travel",
  },
  {
    id: "rare",
    label: "Rare",
    weight: 1200,
    theme: "Wildlife and showbiz: wild and exotic animals, music, film and the stage",
  },
  {
    id: "uncommon",
    label: "Uncommon",
    weight: 2700,
    theme: "People, pets and play: faces, people, small animals, sports, games and toys",
  },
  {
    id: "common",
    label: "Common",
    weight: 5500,
    theme: "Everyday things: food, nature, clothes, home and office, vehicles and signs",
  },
] as const;

export type Rarity = (typeof RARITIES)[number]["id"];

export const TOTAL_WEIGHT = RARITIES.reduce((sum, { weight }) => sum + weight, 0);

/** 0 = rarest. Used to sort by rarity. */
export const rarityRank = (rarity: Rarity): number => RARITIES.findIndex(({ id }) => id === rarity);

/** Utility classes (defined in app/index.css) that set the `--rarity` color variable. */
export const RARITY_CLASS = {
  galaxyOpal: "rarity-galaxyOpal",
  mythic: "rarity-mythic",
  legendary: "rarity-legendary",
  epic: "rarity-epic",
  rare: "rarity-rare",
  uncommon: "rarity-uncommon",
  common: "rarity-common",
} as const satisfies Record<Rarity, string>;

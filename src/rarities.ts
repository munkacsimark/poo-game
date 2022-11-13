const rarities = {
  GALAXY_OPAL: "galaxyOpal",
  LEGENDARY: "legendary",
  EPIC: "epic",
  RARE: "rare",
  UNCOMMON: "uncommon",
  COMMON: "common",
} as const;

type Rarity = typeof rarities[keyof typeof rarities];

export { rarities };
export type { Rarity };

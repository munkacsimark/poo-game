import config from "./config";

const rarities = {
  GALAXY_OPAL: "galaxyOpal",
  LEGENDARY: "legendary",
  EPIC: "epic",
  RARE: "rare",
  UNCOMMON: "uncommon",
  COMMON: "common",
};

const getRarity = () => {
  const randomNumber = Math.random() * 233;

  if (randomNumber <= 1) return rarities.GALAXY_OPAL;
  if (randomNumber > 1 && randomNumber <= 5) return rarities.LEGENDARY;
  if (randomNumber > 5 && randomNumber <= 13) return rarities.EPIC;
  if (randomNumber > 13 && randomNumber <= 34) return rarities.RARE;
  if (randomNumber >= 34 && randomNumber < 89) return rarities.UNCOMMON;
  else return rarities.COMMON;
};

const getEmojiRarity = (emoji: any) => {
  if (config.GALAXY_OPAL_EMOJIS.includes(emoji)) return rarities.GALAXY_OPAL;
  if (config.LEGENDARY_EMOJIS.includes(emoji)) return rarities.LEGENDARY;
  if (config.EPIC_EMOJIS.includes(emoji)) return rarities.EPIC;
  if (config.RARE_EMOJIS.includes(emoji)) return rarities.RARE;
  if (config.UNCOMMON_EMOJIS.includes(emoji)) return rarities.UNCOMMON;
  return rarities.COMMON;
};

const getRandomEmoji = (rarity?: string) => {
  const generatedRarity = rarity || getRarity();

  const configKeyMap = {
    galaxyOpal: "GALAXY_OPAL_EMOJIS",
    legendary: "LEGENDARY_EMOJIS",
    epic: "EPIC_EMOJIS",
    rare: "RARE_EMOJIS",
    uncommon: "UNCOMMON_EMOJIS",
    common: "COMMON_EMOJIS",
  };

  // TODO: wtf is this?
  // @ts-ignore
  return config[configKeyMap[generatedRarity]][
    // @ts-ignore
    Math.floor(Math.random() * config[configKeyMap[generatedRarity]].length)
  ];
};

const getPooLimit = () => Math.floor(Math.random() * config.POO_LIMIT) + 1;

const emojiSorter = (a: any, b: any) => {
  const { emoji: emojiA } = a;
  const { emoji: emojiB } = b;
  if (emojiA === emojiB) return 0;
  if (emojiA > emojiB) return 1;
  return -1;
};

const emojiRaritySorter = (a: any, b: any) => {
  const { emoji: emojiA } = a;
  const { emoji: emojiB } = b;

  const rarityMap = {
    galaxyOpal: 5,
    legendary: 4,
    epic: 3,
    rare: 2,
    uncommon: 1,
    common: 0,
  };

  // @ts-ignore
  const emojiARarity = rarityMap[getEmojiRarity(emojiA)];
  // @ts-ignore
  const emojiBRarity = rarityMap[getEmojiRarity(emojiB)];

  if (emojiARarity === emojiBRarity) return 0;
  if (emojiARarity < emojiBRarity) return 1;
  return -1;
};

export {
  rarities,
  getPooLimit,
  getRandomEmoji,
  getEmojiRarity,
  emojiSorter,
  emojiRaritySorter,
};

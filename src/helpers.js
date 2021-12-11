import { config } from "./config";

const rarities = {
  LEGENDARY: "legendary",
  EPIC: "epic",
  RARE: "rare",
  COMMON: "common",
};

const getRarity = () => {
  const randomNumber = Math.random() * 100;
  if (randomNumber < 2) return rarities.LEGENDARY;
  if (randomNumber >= 2 && randomNumber < 6) return rarities.EPIC;
  if (randomNumber >= 6 && randomNumber < 21) return rarities.RARE;
  else return rarities.COMMON;
};

const getEmojiRarity = (emoji) => {
  if (config.LEGENDARY_EMOJIS.includes(emoji)) return rarities.LEGENDARY;
  if (config.EPIC_EMOJIS.includes(emoji)) return rarities.EPIC;
  if (config.RARE_EMOJIS.includes(emoji)) return rarities.RARE;
  return rarities.COMMON;
};

const getRandomEmoji = (rarity) => {
  const generatedRarity = rarity || getRarity();

  const configKeyMap = {
    legendary: "LEGENDARY_EMOJIS",
    epic: "EPIC_EMOJIS",
    rare: "RARE_EMOJIS",
    common: "COMMON_EMOJIS",
  };

  return config[configKeyMap[generatedRarity]][
    Math.floor(Math.random() * config[configKeyMap[generatedRarity]].length)
  ];
};

const getPooLimit = () => Math.floor(Math.random() * config.POO_LIMIT) + 1;

const emojiSorter = (a, b) => {
  const { emoji: emojiA } = a;
  const { emoji: emojiB } = b;
  if (emojiA === emojiB) return 0;
  if (emojiA > emojiB) return 1;
  return -1;
};

const emojiRaritySorter = (a, b) => {
  const { emoji: emojiA } = a;
  const { emoji: emojiB } = b;

  const rarityMap = {
    legendary: 3,
    epic: 2,
    rare: 1,
    common: 0,
  };

  const emojiARarity = rarityMap[getEmojiRarity(emojiA)];
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

import config from "./config";
import {
  CommonEmoji,
  commonEmojis,
  Emoji,
  EpicEmoji,
  epicEmojis,
  GalaxyOpalEmoji,
  galaxyOpalEmojis,
  isEpicEmoji,
  isGalaxyOpalEmoji,
  isLegendaryEmoji,
  isRareEmoji,
  isUncommonEmoji,
  LegendaryEmoji,
  legendaryEmojis,
  RareEmoji,
  rareEmojis,
  UncommonEmoji,
  uncommonEmojis,
} from "./emojis";
import { rarities, Rarity } from "./rarities";

const getRandomRarity = (): Rarity => {
  const randomNumber = Math.random() * 233;

  if (randomNumber <= 1) {
    return rarities.GALAXY_OPAL;
  }
  if (randomNumber > 1 && randomNumber <= 5) {
    return rarities.LEGENDARY;
  }
  if (randomNumber > 5 && randomNumber <= 13) {
    return rarities.EPIC;
  }
  if (randomNumber > 13 && randomNumber <= 34) {
    return rarities.RARE;
  }
  if (randomNumber >= 34 && randomNumber < 89) {
    return rarities.UNCOMMON;
  } else {
    return rarities.COMMON;
  }
};

const getEmojiRarity = (emoji: Emoji): Rarity => {
  if (isGalaxyOpalEmoji(emoji)) {
    return rarities.GALAXY_OPAL;
  }
  if (isLegendaryEmoji(emoji)) {
    return rarities.LEGENDARY;
  }
  if (isEpicEmoji(emoji)) {
    return rarities.EPIC;
  }
  if (isRareEmoji(emoji)) {
    return rarities.RARE;
  }
  if (isUncommonEmoji(emoji)) {
    return rarities.UNCOMMON;
  }
  return rarities.COMMON;
};

const getRandomCommonEmoji = (): CommonEmoji =>
  commonEmojis[Math.floor(Math.random() * commonEmojis.length)];

const getRandomUncommonEmoji = (): UncommonEmoji =>
  uncommonEmojis[Math.floor(Math.random() * uncommonEmojis.length)];

const getRandomRareEmoji = (): RareEmoji =>
  rareEmojis[Math.floor(Math.random() * rareEmojis.length)];

const getRandomEpicEmoji = (): EpicEmoji =>
  epicEmojis[Math.floor(Math.random() * epicEmojis.length)];

const getRandomLegendaryEmoji = (): LegendaryEmoji =>
  legendaryEmojis[Math.floor(Math.random() * legendaryEmojis.length)];

const getRandomGalaxyOpalEmoji = (): GalaxyOpalEmoji =>
  galaxyOpalEmojis[Math.floor(Math.random() * galaxyOpalEmojis.length)];

const getRandomEmoji = (): Emoji => {
  const rarity: Rarity = getRandomRarity();

  switch (rarity) {
    case rarities.GALAXY_OPAL:
      return getRandomGalaxyOpalEmoji();
    case rarities.LEGENDARY:
      return getRandomLegendaryEmoji();
    case rarities.EPIC:
      return getRandomEpicEmoji();
    case rarities.RARE:
      return getRandomRareEmoji();
    case rarities.UNCOMMON:
      return getRandomUncommonEmoji();
    default:
      return getRandomCommonEmoji();
  }
};

const getRandomPooLimit = (): number =>
  Math.floor(Math.random() * config.POO_LIMIT) + 1;

export {
  rarities,
  getRandomPooLimit,
  getRandomCommonEmoji,
  getRandomEmoji,
  getEmojiRarity,
};

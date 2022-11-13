import {
  galaxyOpalEmojis,
  legendaryEmojis,
  epicEmojis,
  rareEmojis,
  uncommonEmojis,
  commonEmojis,
} from "./emojis";

// TODO refact emoji data handling

const config = Object.freeze({
  GALAXY_OPAL_EMOJIS: galaxyOpalEmojis,
  LEGENDARY_EMOJIS: legendaryEmojis,
  EPIC_EMOJIS: epicEmojis,
  RARE_EMOJIS: rareEmojis,
  UNCOMMON_EMOJIS: uncommonEmojis,
  COMMON_EMOJIS: commonEmojis,
  POO_LIMIT: 60,
  COLLECTED_EMOJIS_STORAGE_KEY: "collected_emojis",
  LAST_EMOJI_STORAGE_KEY: "last_emoji",
  CLICKS_STORAGE_KEY: "clicks",
});

export default config;

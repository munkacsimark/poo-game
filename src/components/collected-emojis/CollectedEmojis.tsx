import { Emoji } from "../../emojis";
import { getEmojiRarity } from "../../helpers";
import * as styles from "./CollectedEmojis.module.css";

type CollectedEmoji = {
  emoji: Emoji;
  pcs: number;
};

const emojiSorter = (
  { emoji: emojiA }: CollectedEmoji,
  { emoji: emojiB }: CollectedEmoji,
): 0 | 1 | -1 => {
  if (emojiA === emojiB) return 0;
  if (emojiA > emojiB) return 1;
  return -1;
};

const emojiPcsCollectedSorter = (
  { pcs: pcsA }: CollectedEmoji,
  { pcs: pcsB }: CollectedEmoji,
): 0 | 1 | -1 => {
  if (pcsA === pcsB) return 0;
  if (pcsA < pcsB) return 1;
  return -1;
};

const emojiRaritySorter = (
  { emoji: emojiA }: CollectedEmoji,
  { emoji: emojiB }: CollectedEmoji,
): 0 | 1 | -1 => {
  const rarityMap = {
    galaxyOpal: 5,
    legendary: 4,
    epic: 3,
    rare: 2,
    uncommon: 1,
    common: 0,
  };

  const emojiARarity = rarityMap[getEmojiRarity(emojiA)];
  const emojiBRarity = rarityMap[getEmojiRarity(emojiB)];

  if (emojiARarity === emojiBRarity) return 0;
  if (emojiARarity < emojiBRarity) return 1;
  return -1;
};

const CollectedEmojis = ({
  collectedEmojis,
  onSelectEmoji,
}: {
  collectedEmojis: CollectedEmoji[];
  onSelectEmoji: (emoji: Emoji) => void;
}) => (
  <div className={styles.collectedEmojis}>
    {collectedEmojis
      .sort(emojiSorter)
      .sort(emojiPcsCollectedSorter)
      .sort(emojiRaritySorter)
      .map(({ emoji, pcs }: CollectedEmoji) => (
        <span
          key={emoji}
          className={`${styles.emoji} ${styles[getEmojiRarity(emoji)]}`}
          onClick={() => onSelectEmoji(emoji)}
        >
          {emoji}
          <span className={styles.emojiPcs}>{pcs}</span>
        </span>
      ))}
  </div>
);

export default CollectedEmojis;
export type { CollectedEmoji };

import { Emoji } from "../../emojis";
import { getEmojiRarity } from "../../helpers";
import styles from "./CollectedEmojis.module.css";

type CollectedEmoji = {
  emoji: Emoji;
  pcs: number;
};

const collectedEmojiSorter = (
  a: CollectedEmoji,
  b: CollectedEmoji
): 0 | 1 | -1 => {
  const { emoji: emojiA } = a;
  const { emoji: emojiB } = b;
  if (emojiA === emojiB) return 0;
  if (emojiA > emojiB) return 1;
  return -1;
};

const collectedEmojiRaritySorter = (
  a: CollectedEmoji,
  b: CollectedEmoji
): 0 | 1 | -1 => {
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
      .sort(collectedEmojiSorter)
      .sort(collectedEmojiRaritySorter)
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

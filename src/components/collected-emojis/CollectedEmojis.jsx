import { getEmojiRarity, emojiSorter, emojiRaritySorter } from "../../helpers";
import styles from "./CollectedEmojis.module.css";

const CollectedEmojis = ({ collectedEmojis, onSelectEmoji }) => (
  <div className={styles.collectedEmojis}>
    {collectedEmojis
      .sort(emojiSorter)
      .sort(emojiRaritySorter)
      .map(({ emoji, pcs }) => (
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

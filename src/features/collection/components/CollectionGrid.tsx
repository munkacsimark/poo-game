import type { Emoji } from "../../game/emojis";
import type { CollectionEntry } from "../collection";
import styles from "./CollectionGrid.module.css";

type Props = {
  entries: CollectionEntry[];
  onSelect: (emoji: Emoji) => void;
};

export const CollectionGrid = ({ entries, onSelect }: Props) => (
  <ul className={styles.collectedEmojis} aria-label="Your collection">
    {entries.map(({ emoji, count, rarity }) => (
      <li key={emoji}>
        <button
          type="button"
          className={`${styles.emoji} ${styles[rarity]}`}
          onClick={() => onSelect(emoji)}
          aria-label={`${emoji}, ${count} collected`}
        >
          {emoji}
          <span className={styles.emojiPcs} aria-hidden>
            {count}
          </span>
        </button>
      </li>
    ))}
  </ul>
);

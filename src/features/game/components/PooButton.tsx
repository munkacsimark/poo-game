import { useRef } from "react";
import { getRarity, type Emoji } from "../emojis";
import styles from "./PooButton.module.css";

type Props = {
  emoji: Emoji;
  dropping: boolean;
  onPush: () => void;
};

export const PooButton = ({ emoji, dropping, onPush }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onPush();
    buttonRef.current?.animate([{ transform: "scale(0.8)" }, { transform: "scale(1)" }], {
      duration: 200,
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label={`Push the ${emoji}`}
    >
      <span className={`${styles.poo} ${dropping ? styles.animatePoo : ""}`} aria-hidden>
        💩
      </span>
      {/* Keyed so the shine animation replays whenever the emoji changes. */}
      <span
        key={emoji}
        className={`${styles.selectedEmoji} ${styles[getRarity(emoji)]} ${styles.animateBackground}`}
        aria-hidden
      >
        {emoji}
      </span>
    </button>
  );
};

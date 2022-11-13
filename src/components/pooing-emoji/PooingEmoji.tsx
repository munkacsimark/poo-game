import { useEffect, useState } from "react";
import { Emoji } from "../../emojis";
import { getEmojiRarity } from "../../helpers";
import styles from "./PooingEmoji.module.css";

const PooingEmoji = ({
  animatePushClass,
  animatePooClass,
  selectedEmoji,
  doFart,
}: {
  animatePushClass: boolean;
  animatePooClass: boolean;
  selectedEmoji: Emoji | null;
  doFart: () => Promise<void>;
}) => {
  const [reflectionAnimation, setReflectionAnimation] =
    useState<boolean>(false);

  useEffect(() => {
    setReflectionAnimation(true);
    setTimeout(() => {
      setReflectionAnimation(false);
    }, 700);
  }, [selectedEmoji]);

  return (
    <button
      className={`${styles.button} ${
        animatePushClass ? styles.animateButton : ""
      }`}
      onClick={doFart}
    >
      <span
        className={`${styles.poo} ${animatePooClass ? styles.animatePoo : ""}`}
        role="img"
        aria-label="Poo emoji"
      >
        💩
      </span>
      {selectedEmoji && (
        <span
          className={`${styles.selectedEmoji} ${
            /* HACK: css depends on rarity names */
            styles[getEmojiRarity(selectedEmoji)]
          } ${reflectionAnimation ? styles.animateBackground : ""}`}
          role="img"
          aria-label="Random emoji"
        >
          {selectedEmoji}
        </span>
      )}
    </button>
  );
};

export default PooingEmoji;

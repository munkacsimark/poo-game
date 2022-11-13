import { useEffect, useState } from "react";
import { getEmojiRarity } from "../../helpers";
import styles from "./PooingEmoji.module.css";

const PooingEmoji = ({
  animatePushClass,
  animatePooClass,
  selectedEmoji,
  doFart,
}: {
  animatePushClass: any;
  animatePooClass: any;
  selectedEmoji: any;
  doFart: any;
}) => {
  const [reflectionAnimation, setReflectionAnimation] = useState(false);

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
      <span
        className={`${styles.selectedEmoji} ${
          styles[getEmojiRarity(selectedEmoji)]
        } ${reflectionAnimation ? styles.animateBackground : ""}`}
        role="img"
        aria-label="Random emoji"
      >
        {selectedEmoji}
      </span>
    </button>
  );
};

export default PooingEmoji;

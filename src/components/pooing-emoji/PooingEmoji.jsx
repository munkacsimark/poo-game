import styles from "./PooingEmoji.module.css";

const PooingEmoji = ({
  animatePushClass,
  animatePooClass,
  selectedEmoji,
  doFart,
}) => {
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
      <span role="img" aria-label="Random animal emoji">
        {selectedEmoji}
      </span>
    </button>
  );
};

export default PooingEmoji;

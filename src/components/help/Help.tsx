import styles from "./Help.module.css";

const Help = ({
  openHelp,
  animateHelpClass,
}: {
  openHelp: () => void;
  animateHelpClass: boolean;
}) => (
  <div className={styles.help} onClick={openHelp}>
    <span role="img" aria-label="Question mark emoji">
      ❓
    </span>
    <span
      className={`${styles.text}${
        animateHelpClass ? " " + styles.animateText : ""
      }`}
    >
      Just push the emoji repeatedly and collect them all!
    </span>
  </div>
);

export default Help;

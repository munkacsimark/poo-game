import styles from "./HelpButton.module.css";

export const HelpButton = () => (
  <>
    <button type="button" className={styles.help} popoverTarget="help" aria-label="How to play">
      ❓
    </button>
    <p id="help" popover="auto" className={styles.popover}>
      Just push the emoji repeatedly and collect them all!
    </p>
  </>
);

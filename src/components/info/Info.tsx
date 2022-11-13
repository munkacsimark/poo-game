import { rarities, getEmojiRarity } from "../../helpers";
import styles from "./Info.module.css";

const getEmojiNum = (emojis: any, rarity: any) =>
  emojis.filter(({ emoji }: { emoji: any }) => getEmojiRarity(emoji) === rarity)
    .length;

const Info = ({
  collectedEmojis,
  clicks,
}: {
  collectedEmojis: any;
  clicks: any;
}) => (
  <ul className={styles.info}>
    <li>{`Clicks: ${clicks}`}</li>
    <hr />
    <li>
      <span className={styles.galaxyOpal}>Galaxy Opal: </span>
      {getEmojiNum(collectedEmojis, rarities.GALAXY_OPAL)}
    </li>
    <li>
      <span className={styles.legendary}>Legendary:</span>{" "}
      {getEmojiNum(collectedEmojis, rarities.LEGENDARY)}
    </li>
    <li>
      <span className={styles.epic}>Epic:</span>{" "}
      {getEmojiNum(collectedEmojis, rarities.EPIC)}
    </li>
    <li>
      <span className={styles.rare}>Rare:</span>{" "}
      {getEmojiNum(collectedEmojis, rarities.RARE)}
    </li>
    <li>
      <span className={styles.uncommon}>Uncommon:</span>{" "}
      {getEmojiNum(collectedEmojis, rarities.UNCOMMON)}
    </li>
    <li>
      <span className={styles.common}>Common:</span>{" "}
      {getEmojiNum(collectedEmojis, rarities.COMMON)}
    </li>
  </ul>
);

export default Info;

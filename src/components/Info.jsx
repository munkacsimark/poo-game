import React from "react";
import { rarities, getEmojiRarity } from "../helpers";
import "./Info.css";

const Info = ({ collectedEmojis, clicks }) => (
  <ul className="info">
    <li>{`Clicks: ${clicks}`}</li>
    <li>{`Legendary: ${
      collectedEmojis.filter(
        ({ emoji }) => getEmojiRarity(emoji) === rarities.LEGENDARY
      ).length
    }`}</li>
    <li>{`Epic: ${
      collectedEmojis.filter(
        ({ emoji }) => getEmojiRarity(emoji) === rarities.EPIC
      ).length
    }`}</li>
    <li>{`Rare: ${
      collectedEmojis.filter(
        ({ emoji }) => getEmojiRarity(emoji) === rarities.RARE
      ).length
    }`}</li>
    <li>{`Common: ${
      collectedEmojis.filter(
        ({ emoji }) => getEmojiRarity(emoji) === rarities.COMMON
      ).length
    }`}</li>
  </ul>
);

export default Info;

import React from "react";
import { getEmojiRarity, emojiSorter, emojiRaritySorter } from "../helpers";
import "./CollectedEmojis.css";

const CollectedEmojis = ({ collectedEmojis, onSelectEmoji }) => (
  <div className="collectedEmojis">
    {collectedEmojis
      .sort(emojiSorter)
      .sort(emojiRaritySorter)
      .map(({ emoji, pcs }) => (
        <span
          key={emoji}
          className={`emoji ${getEmojiRarity(emoji)}`}
          onClick={() => onSelectEmoji(emoji)}
        >
          {emoji}
          <span className="emojiPcs">{pcs}</span>
        </span>
      ))}
  </div>
);

export default CollectedEmojis;

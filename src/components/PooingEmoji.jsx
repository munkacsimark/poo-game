import React from "react";
import "./PooingEmoji.css";

const PooingEmoji = ({
  animatePushClass,
  animatePooClass,
  selectedEmoji,
  doFart,
}) => {
  return (
    <button
      className={`button ${animatePushClass ? "animate" : ""}`}
      onClick={doFart}
    >
      <span
        className={`poo ${animatePooClass ? "animate" : ""}`}
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

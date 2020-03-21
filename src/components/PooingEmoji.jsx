import React from "react";
import "./PooingEmoji.css";

const PooingEmoji = ({
  animatePushClass,
  animatePooClass,
  selectedEmoji,
  doFart
}) => {
  return (
    <div
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
    </div>
  );
};

export default PooingEmoji;

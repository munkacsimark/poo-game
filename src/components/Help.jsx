import React from "react";
import "./Help.css";

const Help = ({ openHelp, animateHelpClass }) => (
  <div className="help" onClick={openHelp}>
    <span role="img" aria-label="Question mark emoji">
      ❓
    </span>
    <span className={`text ${animateHelpClass ? "animate" : ""}`}>
      Just push the animal{" "}
      <span role="img" aria-label="Pointing hand emoji">
        👉
      </span>
    </span>
  </div>
);

export default Help;

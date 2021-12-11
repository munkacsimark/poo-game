import React, { useState, useEffect } from "react";
import "./App.css";
import Help from "./components/Help";
import PooingEmoji from "./components/PooingEmoji";
import Footer from "./components/Footer";
import {
  rarities,
  getPooLimit,
  getRandomEmoji,
  getEmojiRarity,
  emojiSorter,
  emojiRaritySorter,
} from "./helpers";
import { getRandomFart } from "./assets/farts/farts";

const App = () => {
  const [isUiFrozen, setIsUiFrozen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [limit, setLimit] = useState(null);
  const [counter, setCounter] = useState(0);
  const [animatePooClass, setAnimatePooClass] = useState(false);
  const [animatePushClass, setAnimatePushClass] = useState(false);
  const [animateHelpClass, setAnimateHelpClass] = useState(false);
  const [collectedEmojis, setCollectedEmojis] = useState([]);

  const doPoo = () =>
    new Promise((resolve) => {
      setAnimatePooClass(true);
      const timeout = setTimeout(() => {
        setAnimatePooClass(false);
        clearTimeout(timeout);
        resolve();
      }, 2000);
    });

  const doFart = () => {
    if (isUiFrozen) return;
    setAnimatePushClass(true);
    const timeout = setTimeout(() => {
      setAnimatePushClass(false);
      clearTimeout(timeout);
    }, 200);
    setCounter(counter + 1);
    const fartSound = new Audio(getRandomFart());
    fartSound.play();
  };

  const openHelp = () => {
    setAnimateHelpClass(true);
    const timeout = setTimeout(() => {
      setAnimateHelpClass(false);
      clearTimeout(timeout);
    }, 5000);
  };

  useEffect(() => {
    setLimit(getPooLimit());
    const emoji = getRandomEmoji(rarities.COMMON);
    setSelectedEmoji(emoji);
    setCollectedEmojis([
      {
        emoji,
        pcs: 1,
      },
    ]);
  }, []);

  useEffect(() => {
    async function counterCheck() {
      setIsUiFrozen(true);
      if (counter === limit) {
        let newEmoji = getRandomEmoji();
        await doPoo();
        setCounter(0);
        setLimit(getPooLimit());
        while (newEmoji === selectedEmoji) newEmoji = getRandomEmoji();
        setSelectedEmoji(newEmoji);
        setCollectedEmojis((emojis) => {
          const existingEmoji = emojis.find(({ emoji }) => newEmoji === emoji);
          if (existingEmoji)
            return [
              ...emojis.filter(({ emoji }) => emoji !== existingEmoji.emoji),
              { emoji: existingEmoji.emoji, pcs: existingEmoji.pcs + 1 },
            ];
          return [...emojis, { emoji: newEmoji, pcs: 1 }];
        });
      }
      setIsUiFrozen(false);
    }
    counterCheck();
  }, [counter, limit, selectedEmoji]);

  return (
    <div className="App">
      <Help openHelp={openHelp} animateHelpClass={animateHelpClass} />
      <PooingEmoji
        animatePushClass={animatePushClass}
        animatePooClass={animatePooClass}
        selectedEmoji={selectedEmoji}
        doFart={doFart}
      />
      <div className="collectedEmojis">
        {collectedEmojis
          .sort(emojiSorter)
          .sort(emojiRaritySorter)
          .map(({ emoji, pcs }) => (
            <span className={`emoji ${getEmojiRarity(emoji)}`}>
              {emoji}
              <span className="emoji-pcs">{pcs}</span>
            </span>
          ))}
      </div>
      <Footer />
    </div>
  );
};

export default App;

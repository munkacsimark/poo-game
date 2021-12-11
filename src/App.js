import React, { useState, useEffect } from "react";
import { setItem, getItem } from "local-data-storage";
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
import config from "./config";

const logEmojis = () => {
  console.log(`LEGENDARY:${config.LEGENDARY_EMOJIS.length}`);
  console.log(`EPIC:${config.EPIC_EMOJIS.length}`);
  console.log(`RARE:${config.RARE_EMOJIS.length}`);
  console.log(`COMMON:${config.COMMON_EMOJIS.length}`);
};

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
    logEmojis();

    setLimit(getPooLimit());

    const savedCollectedEmojis = getItem(
      config.COLLECTED_EMOJIS_STORAGE_KEY
    )?.value;
    const lastEmoji = getItem(config.LAST_EMOJI_STORAGE_KEY)?.value;
    const emoji = getRandomEmoji(rarities.COMMON);

    setCollectedEmojis(
      savedCollectedEmojis ?? [{ emoji: lastEmoji ?? emoji, pcs: 1 }]
    );
    setSelectedEmoji(lastEmoji ?? emoji);
    setItem(config.LAST_EMOJI_STORAGE_KEY, { value: lastEmoji ?? emoji }, true);
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

          const emojisToSave = [...emojis, { emoji: newEmoji, pcs: 1 }];
          setItem(
            config.COLLECTED_EMOJIS_STORAGE_KEY,
            { value: emojisToSave },
            true
          );
          setItem(config.LAST_EMOJI_STORAGE_KEY, { value: newEmoji }, true);
          return emojisToSave;
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
            <span key={emoji} className={`emoji ${getEmojiRarity(emoji)}`}>
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

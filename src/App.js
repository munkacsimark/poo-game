import React, { useState, useEffect } from "react";
import "./App.css";
import Help from "./components/Help";
import PooingEmoji from "./components/PooingEmoji";
import Footer from "./components/Footer";
import config from "./config";
import { getRandomFart } from "./assets/farts/farts";

const getRandomEmoji = () =>
  config.EMOJIS[Math.floor(Math.random() * config.EMOJIS.length)];
const getPooLimit = () => {
  const limit = Math.floor(Math.random() * config.POO_LIMIT) + 1;
  console.log(`LIMIT: ${limit}`);
  return limit;
};

const App = () => {
  const [isUiFrozen, setIsUiFrozen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [limit, setLimit] = useState(null);
  const [counter, setCounter] = useState(0);
  const [animatePooClass, setAnimatePooClass] = useState(false);
  const [animatePushClass, setAnimatePushClass] = useState(false);
  const [animateHelpClass, setAnimateHelpClass] = useState(false);

  const doPoo = () =>
    new Promise((resolve, reject) => {
      console.log("POOOOO");
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
    setSelectedEmoji(getRandomEmoji());
  }, []);

  useEffect(() => {
    async function counterCheck() {
      setIsUiFrozen(true);
      console.log(`COUNTER: ${counter}`);
      if (counter === limit) {
        let newEmoji = getRandomEmoji();
        await doPoo();
        setCounter(0);
        setLimit(getPooLimit());
        while (newEmoji === selectedEmoji) newEmoji = getRandomEmoji();
        setSelectedEmoji(newEmoji);
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
      <Footer />
    </div>
  );
};

export default App;

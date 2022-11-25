import { useState, useEffect } from "react";
import { setItem, getItem } from "local-data-storage";
import Help from "./components/help/Help";
import PooingEmoji from "./components/pooing-emoji/PooingEmoji";
import Info from "./components/info/Info";
import Footer from "./components/footer/Footer";
import CollectedEmojis, {
  CollectedEmoji,
} from "./components/collected-emojis/CollectedEmojis";
import {
  getRandomPooLimit,
  getRandomEmoji,
  getRandomCommonEmoji,
} from "./helpers";
import { getRandomFart } from "./assets/farts/farts";
import config from "./config";
import { Emoji } from "./emojis";
import * as styles from "./App.module.css";

const App = () => {
  const [isUiFrozen, setIsUiFrozen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [limit, setLimit] = useState<null | number>(null);
  const [counter, setCounter] = useState<number>(0);
  const [animatePooClass, setAnimatePooClass] = useState<boolean>(false);
  const [animatePushClass, setAnimatePushClass] = useState<boolean>(false);
  const [animateHelpClass, setAnimateHelpClass] = useState<boolean>(false);
  const [collectedEmojis, setCollectedEmojis] = useState<CollectedEmoji[]>([]);
  const [clicks, setClicks] = useState<number>(0);

  let fartSound: HTMLAudioElement = new Audio(getRandomFart());

  const doPoo = (): Promise<void> =>
    new Promise<void>((resolve) => {
      setAnimatePooClass(true);
      const timeout = setTimeout(() => {
        setAnimatePooClass(false);
        clearTimeout(timeout);
        resolve();
      }, 2000);
    });

  const doFart = async (): Promise<void> => {
    if (isUiFrozen) {
      return;
    }

    setAnimatePushClass(true);

    const timeout = setTimeout(() => {
      setAnimatePushClass(false);
      clearTimeout(timeout);
    }, 200);

    setCounter(counter + 1);

    await fartSound.play();
    fartSound = new Audio(getRandomFart());

    const savedClicks = getItem(config.CLICKS_STORAGE_KEY)?.value;
    setItem(
      config.CLICKS_STORAGE_KEY,
      {
        value: savedClicks ? savedClicks + 1 : 1,
      },
      true,
    );
    setClicks((currentClicks) => currentClicks + 1);
  };

  const openHelp = (): void => {
    setAnimateHelpClass(true);
    const timeout = setTimeout(() => {
      setAnimateHelpClass(false);
      clearTimeout(timeout);
    }, config.HELP_OPEN_TIMEOUT);
  };

  useEffect(() => {
    setLimit(getRandomPooLimit());

    const savedCollectedEmojis: CollectedEmoji[] | null = getItem(
      config.COLLECTED_EMOJIS_STORAGE_KEY,
    )?.value;
    const lastEmoji: Emoji | null = getItem(
      config.LAST_EMOJI_STORAGE_KEY,
    )?.value;
    const clicks: number | null = getItem(config.CLICKS_STORAGE_KEY)?.value;
    const emoji = getRandomCommonEmoji();

    setCollectedEmojis(
      savedCollectedEmojis ?? [{ emoji: lastEmoji ?? emoji, pcs: 1 }],
    );
    setSelectedEmoji(lastEmoji ?? emoji);
    setClicks(clicks ?? 0);
  }, []);

  useEffect(() => {
    const counterCheck = async (): Promise<void> => {
      if (counter !== limit) {
        return;
      }

      setIsUiFrozen(true);

      let newEmoji: Emoji = getRandomEmoji();
      await doPoo();
      setCounter(0);
      setLimit(getRandomPooLimit());
      while (newEmoji === selectedEmoji) {
        newEmoji = getRandomEmoji();
      }
      setSelectedEmoji(newEmoji);
      setCollectedEmojis((emojis) => {
        const existingEmoji = emojis.find(({ emoji }) => newEmoji === emoji);
        if (existingEmoji) {
          return [
            ...emojis.filter(({ emoji }) => emoji !== existingEmoji.emoji),
            { emoji: existingEmoji.emoji, pcs: existingEmoji.pcs + 1 },
          ];
        }

        const emojisToSave = [...emojis, { emoji: newEmoji, pcs: 1 }];
        setItem(
          config.COLLECTED_EMOJIS_STORAGE_KEY,
          { value: emojisToSave },
          true,
        );
        setItem(config.LAST_EMOJI_STORAGE_KEY, { value: newEmoji }, true);

        return emojisToSave;
      });

      setIsUiFrozen(false);
    };

    counterCheck();
  }, [counter, limit, selectedEmoji]);

  return (
    <div className={styles.app}>
      <div className={styles.backgroundImage} />
      <div className={styles.mainSection}>
        <Help openHelp={openHelp} animateHelpClass={animateHelpClass} />
        <Info collectedEmojis={collectedEmojis} clicks={clicks} />
        <PooingEmoji
          animatePushClass={animatePushClass}
          animatePooClass={animatePooClass}
          selectedEmoji={selectedEmoji}
          doFart={doFart}
        />
      </div>
      <CollectedEmojis
        collectedEmojis={collectedEmojis}
        onSelectEmoji={setSelectedEmoji}
      />
      <Footer />
    </div>
  );
};

export default App;

import { CollectionGrid } from "../features/collection/components/CollectionGrid";
import { CollectionStats } from "../features/collection/components/CollectionStats";
import { rarityStats, sortCollection } from "../features/collection/collection";
import { PooButton } from "../features/game/components/PooButton";
import { useGame } from "../features/game/useGame";
import { HelpButton } from "../features/help/HelpButton";
import styles from "./App.module.css";
import { Footer } from "./Footer";

export const App = () => {
  const { state, push, select } = useGame();
  const entries = sortCollection(state.collection);

  return (
    <div className={styles.app}>
      <div className={styles.backgroundImage} />
      <main className={styles.mainSection}>
        <HelpButton />
        <CollectionStats clicks={state.clicks} stats={rarityStats(entries)} />
        <PooButton emoji={state.selected} dropping={state.phase === "dropping"} onPush={push} />
      </main>
      <CollectionGrid entries={entries} onSelect={select} />
      <Footer />
    </div>
  );
};

import { sortCollection } from "../features/collection/collection";
import { CollectionPanel } from "../features/collection/components/CollectionPanel";
import { PooButton } from "../features/game/components/PooButton";
import { useGame } from "../features/game/useGame";
import { useMuted } from "../features/settings/useMuted";
import { Aurora } from "./Aurora";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const App = () => {
  const [muted, toggleMuted] = useMuted();
  const { state, push, select } = useGame({ muted });
  const entries = sortCollection(state.collection);

  return (
    <div className="relative isolate min-h-dvh">
      <Aurora />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <Header clicks={state.clicks} muted={muted} onToggleMuted={toggleMuted} />
        <main className="grid flex-1 content-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-10 lg:pt-6">
          <div className="lg:sticky lg:top-6">
            <PooButton
              emoji={state.selected}
              dropping={state.phase === "dropping"}
              showHint={state.clicks < 10}
              onPush={push}
            />
          </div>
          <CollectionPanel
            entries={entries}
            selected={state.selected}
            lastDrop={state.lastDrop}
            onSelect={select}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

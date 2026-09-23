import { sortCollection } from "../features/collection/collection";
import { CollectionPanel } from "../features/collection/components/CollectionPanel";
import { PooButton } from "../features/game/components/PooButton";
import type { SaveData } from "../features/game/save";
import { useGame } from "../features/game/useGame";
import { ProfileButton } from "../features/profiles/components/ProfileButton";
import type { Profile } from "../features/profiles/profiles";
import { Header } from "./Header";

type Props = {
  profile: Profile;
  onSave: (save: SaveData) => void;
  muted: boolean;
  onToggleMuted: () => void;
};

/** The game for one profile. Render it with `key={profile.id}` so switching reloads the save. */
export const GameScreen = ({ profile, onSave, muted, onToggleMuted }: Props) => {
  const { state, push, select } = useGame({ save: profile.save, onSave, muted });
  const entries = sortCollection(state.collection);

  return (
    <>
      <Header
        clicks={state.clicks}
        muted={muted}
        onToggleMuted={onToggleMuted}
        profileButton={<ProfileButton profile={profile} />}
      />
      {/* The stage comes first in the DOM (top on phones); on large screens the collection sits left. */}
      <main className="grid flex-1 content-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:pt-6">
        <div className="lg:sticky lg:top-6">
          <PooButton
            emoji={state.selected}
            dropping={state.phase === "dropping"}
            locked={state.phase !== "idle"}
            lastDrop={state.lastDrop}
            showHint={state.clicks < 10}
            onPush={push}
          />
        </div>
        <div className="lg:order-first">
          <CollectionPanel
            entries={entries}
            selected={state.selected}
            lastDrop={state.lastDrop}
            onSelect={select}
          />
        </div>
      </main>
    </>
  );
};

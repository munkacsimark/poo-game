import { useState } from "react";
import { FaqLink } from "../features/faq/FaqLink";
import { VersionButton } from "../features/changelog/VersionButton";
import { ProfilePicker } from "../features/profiles/components/ProfilePicker";
import { useProfiles } from "../features/profiles/useProfiles";
import { useMuted } from "../features/settings/useMuted";
import { Aurora } from "./Aurora";
import { GameScreen } from "./GameScreen";

export const App = () => {
  const [muted, toggleMuted] = useMuted();
  const [{ activeId, profiles }, dispatch] = useProfiles();
  // Like a streaming service: ask who's playing on launch when there's more than one profile.
  const [picking, setPicking] = useState(() => profiles.length > 1);
  const active = profiles.find(({ id }) => id === activeId);

  return (
    <div className="relative isolate min-h-dvh">
      <Aurora />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        {picking || !active ? (
          <ProfilePicker
            profiles={profiles}
            dispatch={dispatch}
            onPick={(id) => {
              dispatch({ type: "switch", id });
              setPicking(false);
            }}
          />
        ) : (
          <GameScreen
            key={active.id}
            profile={active}
            onSave={(save) => dispatch({ type: "save", id: active.id, save })}
            muted={muted}
            onToggleMuted={toggleMuted}
            onSwitchProfile={() => setPicking(true)}
          />
        )}
        <footer className="flex items-center justify-center gap-1">
          <FaqLink />
          <span aria-hidden className="text-xs text-white/20">
            ·
          </span>
          <VersionButton />
        </footer>
      </div>
    </div>
  );
};

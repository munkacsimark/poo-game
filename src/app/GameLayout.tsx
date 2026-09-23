import { Outlet } from "@tanstack/react-router";
import { useProfiles } from "../features/profiles/ProfilesProvider";
import { useMuted } from "../features/settings/useMuted";
import { GameScreen } from "./GameScreen";

/** The active profile's game; dialog routes (/faq, /changelog) render on top via the outlet. */
export const GameLayout = () => {
  const { active, dispatch } = useProfiles();
  const [muted, toggleMuted] = useMuted();

  return (
    <>
      <GameScreen
        // Remount on switch so the game loads the other profile's save.
        key={active.id}
        profile={active}
        onSave={(save) => dispatch({ type: "save", id: active.id, save })}
        muted={muted}
        onToggleMuted={toggleMuted}
      />
      <Outlet />
    </>
  );
};

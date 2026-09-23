import { createContext, use, useEffect, useReducer, useState, type ReactNode } from "react";
import { profilesReducer, type Profile, type ProfilesAction, type ProfilesState } from "./profiles";
import { SaveErrorScreen } from "./components/SaveErrorScreen";
import { clearSavedData, loadProfiles, writeProfiles } from "./storage";

type ProfilesContextValue = ProfilesState & {
  active: Profile;
  dispatch: (action: ProfilesAction) => void;
  /** Whether someone has picked who's playing in this session (implied with one profile). */
  picked: boolean;
  /** Makes `id` the active profile and marks the session as picked. */
  pick: (id: string) => void;
};

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

/**
 * Loads the saved profiles once. If they can't be used (outdated, newer or damaged data), shows
 * the error screen instead of the app and writes nothing until the player removes the data.
 */
export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(loadProfiles);

  if (loaded.status === "error") {
    return (
      <SaveErrorScreen
        reason={loaded.reason}
        onRemove={() => {
          clearSavedData();
          setLoaded(loadProfiles());
        }}
      />
    );
  }
  return (
    <ProfilesStore initial={loaded.state} base={loaded.base}>
      {children}
    </ProfilesStore>
  );
};

type StoreProps = { initial: ProfilesState; base?: unknown; children: ReactNode };

/** Holds every profile for all routes and persists every change. */
const ProfilesStore = ({ initial, base, children }: StoreProps) => {
  const [state, dispatch] = useReducer(profilesReducer, initial);
  // Like a streaming service: ask who's playing on launch when there's more than one profile.
  const [picked, setPicked] = useState(() => state.profiles.length <= 1);

  useEffect(() => {
    writeProfiles(state, base);
  }, [state, base]);

  // `profiles` is never empty and `activeId` always points into it (see profilesReducer).
  const active = state.profiles.find(({ id }) => id === state.activeId) ?? state.profiles[0];
  if (!active) throw new Error("No profiles");

  const pick = (id: string) => {
    dispatch({ type: "switch", id });
    setPicked(true);
  };

  return (
    <ProfilesContext value={{ ...state, active, dispatch, picked, pick }}>
      {children}
    </ProfilesContext>
  );
};

export const useProfiles = (): ProfilesContextValue => {
  const value = use(ProfilesContext);
  if (!value) throw new Error("useProfiles must be used inside <ProfilesProvider>");
  return value;
};

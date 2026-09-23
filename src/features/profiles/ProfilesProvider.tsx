import { createContext, use, useEffect, useReducer, useState, type ReactNode } from "react";
import { profilesReducer, type Profile, type ProfilesAction, type ProfilesState } from "./profiles";
import { loadProfiles, writeProfiles } from "./storage";

type ProfilesContextValue = ProfilesState & {
  active: Profile;
  dispatch: (action: ProfilesAction) => void;
  /** Whether someone has picked who's playing in this session (implied with one profile). */
  picked: boolean;
  /** Makes `id` the active profile and marks the session as picked. */
  pick: (id: string) => void;
};

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

/** Holds every profile for all routes; loaded once and persisted on every change. */
export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(profilesReducer, undefined, loadProfiles);
  // Like a streaming service: ask who's playing on launch when there's more than one profile.
  const [picked, setPicked] = useState(() => state.profiles.length <= 1);

  useEffect(() => {
    writeProfiles(state);
  }, [state]);

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

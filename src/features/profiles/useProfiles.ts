import { useEffect, useReducer } from "react";
import { profilesReducer } from "./profiles";
import { loadProfiles, writeProfiles } from "./storage";

/** All profiles, loaded once and persisted on every change. */
export const useProfiles = () => {
  const [state, dispatch] = useReducer(profilesReducer, undefined, loadProfiles);

  useEffect(() => {
    writeProfiles(state);
  }, [state]);

  return [state, dispatch] as const;
};

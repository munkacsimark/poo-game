import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

/** The current `location.hash` (e.g. "#faq"), kept in sync with navigation. */
export const useLocationHash = () => useSyncExternalStore(subscribe, () => location.hash);

/** Removes the hash without adding a history entry, and notifies `useLocationHash`. */
export const clearLocationHash = () => {
  history.replaceState(history.state, "", `${location.pathname}${location.search}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

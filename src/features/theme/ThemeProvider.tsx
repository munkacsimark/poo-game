import {
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "../../shared/lib/motion";
import { readJson, writeJson } from "../../shared/lib/storage";
import {
  CANVAS_COLOR,
  parseAppearance,
  resolveMode,
  type Appearance,
  type ResolvedMode,
} from "./themes";

/** Device-wide, like the sound toggle. index.html reads it too, to paint the right theme first. */
const APPEARANCE_KEY = "poo-game:appearance";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const subscribeToSystemMode = (onChange: () => void) => {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

type ThemeContextValue = Appearance & {
  /** The mode in effect: `system` resolved against the device setting. */
  resolvedMode: ResolvedMode;
  setAppearance: (change: Partial<Appearance>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Holds the chosen theme and color mode, applies them to <html> and remembers them. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [appearance, setState] = useState(() => parseAppearance(readJson(APPEARANCE_KEY)));
  const systemDark = useSyncExternalStore(subscribeToSystemMode, systemPrefersDark);
  const resolvedMode = resolveMode(appearance.mode, systemDark);

  // Syncs the document (theme CSS, native controls, browser chrome) with the choice, before
  // paint so a theme switch (and its view transition snapshot) never shows a mixed frame.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = appearance.theme;
    root.dataset.mode = resolvedMode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", CANVAS_COLOR[appearance.theme][resolvedMode]);
  }, [appearance.theme, resolvedMode]);

  useEffect(() => {
    writeJson(APPEARANCE_KEY, appearance);
  }, [appearance]);

  // Cross-fades the whole page into the new look where view transitions are available.
  const setAppearance = (change: Partial<Appearance>) => {
    const update = () => setState((current) => ({ ...current, ...change }));
    if (!document.startViewTransition || prefersReducedMotion()) {
      update();
      return;
    }
    document.startViewTransition(() => flushSync(update));
  };

  return (
    <ThemeContext value={{ ...appearance, resolvedMode, setAppearance }}>{children}</ThemeContext>
  );
};

export const useTheme = (): ThemeContextValue => {
  const value = use(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
};

/** The selectable themes, in picker order. Styles live in themes.css, keyed by `id`. */
export const THEMES = [
  { id: "aurora", label: "Aurora", description: "Frosted glass over drifting color." },
  { id: "retro", label: "Retro Web", description: "A 1997 homepage: bevels, stars, Comic Sans." },
  { id: "hacker", label: "Terminal", description: "Green phosphor, scanlines, a blinking cursor." },
  { id: "luxury", label: "Luxe", description: "Black and ivory, gold leaf and fine serifs." },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

/** `system` follows the device's light/dark setting. */
export const COLOR_MODES = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const;

export type ColorMode = (typeof COLOR_MODES)[number]["id"];
export type ResolvedMode = Exclude<ColorMode, "system">;

export type Appearance = { theme: ThemeId; mode: ColorMode };

export const DEFAULT_APPEARANCE: Appearance = { theme: "aurora", mode: "system" };

/** Each theme's page color (`--color-canvas` in themes.css), for the browser's theme-color. */
export const CANVAS_COLOR: Record<ThemeId, Record<ResolvedMode, string>> = {
  aurora: { dark: "#0b0814", light: "#f6f3fa" },
  retro: { dark: "#000018", light: "#c0c0c0" },
  hacker: { dark: "#020a04", light: "#eef5ec" },
  luxury: { dark: "#0d0b09", light: "#f7f2e8" },
};

const isThemeId = (value: unknown): value is ThemeId => THEMES.some(({ id }) => id === value);
const isColorMode = (value: unknown): value is ColorMode =>
  COLOR_MODES.some(({ id }) => id === value);

/** Reads a stored appearance, falling back field by field to the defaults. */
export const parseAppearance = (value: unknown): Appearance => {
  const { theme, mode }: { theme?: unknown; mode?: unknown } =
    typeof value === "object" && value !== null ? value : {};
  return {
    theme: isThemeId(theme) ? theme : DEFAULT_APPEARANCE.theme,
    mode: isColorMode(mode) ? mode : DEFAULT_APPEARANCE.mode,
  };
};

export const resolveMode = (mode: ColorMode, systemDark: boolean): ResolvedMode =>
  mode === "system" ? (systemDark ? "dark" : "light") : mode;

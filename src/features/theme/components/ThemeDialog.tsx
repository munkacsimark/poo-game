import { useCloseRoute } from "../../../shared/lib/useCloseRoute";
import { Modal } from "../../../shared/ui/Modal";
import { RARITIES, RARITY_CLASS } from "../../game/rarity";
import { useTheme } from "../ThemeProvider";
import { COLOR_MODES, THEMES } from "../themes";

/** /theme: pick a theme (each option previews itself) and light, dark or system mode. */
export const ThemeDialog = () => {
  const { theme, mode, resolvedMode, setAppearance } = useTheme();

  return (
    <Modal title="Theme" onClose={useCloseRoute("/")}>
      <div className="flex flex-col gap-5 pt-3">
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm font-medium text-muted">Style</legend>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(({ id, label, description }) => (
              <label
                key={id}
                className="group cursor-pointer rounded-2xl p-1 ring-accent transition duration-300 ease-spring hover:scale-[1.02] active:scale-95 has-checked:ring-2 has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-canvas"
              >
                <input
                  type="radio"
                  name="theme"
                  value={id}
                  checked={theme === id}
                  onChange={() => setAppearance({ theme: id })}
                  className="sr-only"
                />
                {/* A live sample, rendered in that theme and the current mode. */}
                <span
                  data-theme={id}
                  data-mode={resolvedMode}
                  className="flex h-full flex-col gap-2 overflow-hidden rounded-xl theme-canvas p-3 font-display text-fg"
                >
                  <span className="flex items-center justify-between gap-2 rounded-pill glass px-2 py-1">
                    <span className="font-heading text-sm font-bold">{label}</span>
                    <span aria-hidden className="font-emoji text-sm">
                      💩
                    </span>
                  </span>
                  <span className="text-xs leading-snug text-muted">{description}</span>
                  <span aria-hidden className="mt-auto flex gap-1">
                    {RARITIES.map(({ id: rarity }) => (
                      <span
                        key={rarity}
                        className={`${RARITY_CLASS[rarity]} size-2 rounded-pill bg-(--rarity)`}
                      />
                    ))}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm font-medium text-muted">Mode</legend>
          <div className="grid grid-cols-3 gap-1 rounded-pill glass p-1">
            {COLOR_MODES.map(({ id, label }) => (
              <label
                key={id}
                className="cursor-pointer rounded-pill px-3 py-2 text-center text-sm font-semibold transition duration-300 ease-spring hover:bg-fg/10 active:scale-95 has-checked:bg-accent has-checked:text-on-accent has-focus-visible:ring-2 has-focus-visible:ring-accent"
              >
                <input
                  type="radio"
                  name="mode"
                  value={id}
                  checked={mode === id}
                  onChange={() => setAppearance({ mode: id })}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </Modal>
  );
};

import { openValue, sealValue } from "../shared/lib/sealedStorage";

const SAVE_KEY = "poo-game:profiles";

/**
 * Dev-server-only helpers on `window.pooGameDev` for seeding and inspecting sealed storage from
 * the browser console or chrome-devtools-mcp (see .claude/skills/verify-ui). Never in production.
 */
const devTools = {
  /** Seals a save document (schema.ts, v2) into storage; reload afterwards. */
  writeSave: (document: unknown) => localStorage.setItem(SAVE_KEY, sealValue(document)),
  /** The stored save document, unsealed. */
  readSave: (): unknown => openValue(localStorage.getItem(SAVE_KEY) ?? ""),
};

declare global {
  interface Window {
    pooGameDev?: typeof devTools;
  }
}

window.pooGameDev = devTools;

import { SAVE_VERSION } from "./schema";

type Document = Record<string, unknown>;

/**
 * `MIGRATIONS[n]` upgrades a version-n document (save or profile file) to version n + 1.
 *
 * When SAVE_VERSION goes from n to n + 1: add `MIGRATIONS[n]`, keep it pure (document in,
 * document out, no clock or randomness unless unavoidable), never edit a shipped one, and pin a
 * real version-n fixture in migrations.test.ts. Empty today: v2 is the first versioned format.
 */
const MIGRATIONS: Readonly<Record<number, (document: Document) => Document>> = {};

/** The oldest version this app can still read. Older data gets the "outdated" error. */
const OLDEST_READABLE_VERSION = 2;

export type VersionCheck = "current" | "outdated" | "newer";

export const checkVersion = (version: number): VersionCheck => {
  if (version > SAVE_VERSION) return "newer";
  if (version < OLDEST_READABLE_VERSION) return "outdated";
  return "current";
};

/** Runs every migration from `from` up to `to`, in order. Throws if a step is missing. */
export const migrate = (
  document: Document,
  from: number,
  to: number = SAVE_VERSION,
  migrations: Readonly<Record<number, (document: Document) => Document>> = MIGRATIONS,
): Document => {
  let current = document;
  for (let version = from; version < to; version++) {
    const step = migrations[version];
    if (!step) throw new Error(`No migration from version ${version}`);
    current = { ...step(current), version: version + 1 };
  }
  return current;
};

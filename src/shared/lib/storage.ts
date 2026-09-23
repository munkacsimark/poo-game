/**
 * localStorage access that never throws: storage can be disabled, full, or
 * hold data written by an older version of the app.
 */
export const readJson = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

export const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Progress simply isn't persisted when storage is unavailable.
  }
};

export const readText = (key: string): string | undefined => {
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

export const writeText = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Progress simply isn't persisted when storage is unavailable.
  }
};

export const removeKeys = (...keys: string[]): void => {
  try {
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // Nothing to remove if storage is unavailable.
  }
};

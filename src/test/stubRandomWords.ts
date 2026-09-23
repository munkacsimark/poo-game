import { vi } from "vitest";

/**
 * Makes `crypto.getRandomValues` fill every 32-bit word with `word`, so `secureRandom` returns a
 * fixed value. `stubRandomWords(0)` makes every game roll 0: one push is then enough for a drop,
 * and the drop is always 💩 (Galaxy Opal). Returns the spy so a test can restore it.
 */
export const stubRandomWords = (word: number) =>
  vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    if (array instanceof Uint32Array) array.fill(word);
    return array;
  });

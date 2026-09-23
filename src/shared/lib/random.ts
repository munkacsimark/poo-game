/** Returns a float in [0, 1). */
export type Rng = () => number;

const words = new Uint32Array(2);

/**
 * Uniform float in [0, 1) with the full 53 bits of double precision, drawn from the browser's
 * cryptographically secure generator. Unlike `Math.random`, its output can't be predicted from
 * earlier values and it is uniform by specification rather than by engine choice.
 */
export const secureRandom: Rng = () => {
  crypto.getRandomValues(words);
  const [high = 0, low = 0] = words;
  // 32 high bits followed by the top 21 bits of the second word: 53 bits in total.
  return (high * 2 ** 21 + (low >>> 11)) / 2 ** 53;
};

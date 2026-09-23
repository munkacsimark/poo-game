import { afterEach, describe, expect, it, vi } from "vitest";
import { stubRandomWords } from "../../test/stubRandomWords";
import { secureRandom } from "./random";

describe("secureRandom", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps all-zero bits to 0 and all-one bits to just below 1", () => {
    stubRandomWords(0);
    expect(secureRandom()).toBe(0);
    stubRandomWords(0xff_ff_ff_ff);
    expect(secureRandom()).toBe(1 - 2 ** -53);
  });

  it("is roughly uniform", () => {
    const buckets = Array.from({ length: 10 }, () => 0);
    const samples = 100_000;
    for (let i = 0; i < samples; i++) {
      const index = Math.floor(secureRandom() * 10);
      buckets[index] = (buckets[index] ?? 0) + 1;
    }
    // Each bucket expects 10,000; ±600 is far outside normal variation (σ ≈ 95).
    for (const count of buckets) expect(Math.abs(count - samples / 10)).toBeLessThan(600);
  });
});

import { describe, expect, it } from "vitest";
import { rarityStats, sortCollection, TOTAL_EMOJIS, totalDrops } from "./collection";

describe("sortCollection", () => {
  it("sorts rarest first, then by count", () => {
    const entries = sortCollection({ "🍟": 5, "🦄": 1, "🍺": 9, "💩": 1 });
    expect(entries.map(({ emoji }) => emoji)).toEqual(["💩", "🦄", "🍺", "🍟"]);
  });

  it("does not mutate its input", () => {
    const collection = { "🍟": 5, "🦄": 1 };
    sortCollection(collection);
    expect(Object.keys(collection)).toEqual(["🍟", "🦄"]);
  });
});

describe("rarityStats", () => {
  it("counts distinct emojis per rarity", () => {
    const stats = rarityStats(sortCollection({ "🍟": 5, "🍺": 1, "🦄": 2 }));
    expect(stats.find(({ id }) => id === "common")?.collected).toBe(2);
    expect(stats.find(({ id }) => id === "legendary")?.collected).toBe(1);
    expect(stats.find(({ id }) => id === "epic")?.collected).toBe(0);
  });

  it("reports how many exist per rarity", () => {
    const stats = rarityStats([]);
    expect(stats.find(({ id }) => id === "galaxyOpal")?.total).toBe(1);
    expect(stats.reduce((sum, { total }) => sum + total, 0)).toBe(TOTAL_EMOJIS);
  });
});

describe("totalDrops", () => {
  it("counts duplicates", () => {
    expect(totalDrops(sortCollection({ "🍟": 5, "🦄": 2 }))).toBe(7);
  });
});

import { describe, expect, it } from "vitest";
import type { Collection } from "../game/save";
import { rarityStats, sortCollection, TOTAL_EMOJIS, totalDrops } from "./collection";

/** { "🍟": 5 } → a collection with those counts. */
const owned = (counts: Record<string, number>): Collection =>
  Object.fromEntries(
    Object.entries(counts).map(([emoji, count]) => [
      emoji,
      { count, firstFoundAt: "2026-01-01T00:00:00.000Z" },
    ]),
  );

describe("sortCollection", () => {
  it("sorts rarest first, then by count", () => {
    const entries = sortCollection(owned({ "🍟": 5, "🦄": 1, "🍺": 9, "💩": 1 }));
    expect(entries.map(({ emoji }) => emoji)).toEqual(["💩", "🦄", "🍺", "🍟"]);
  });

  it("does not mutate its input", () => {
    const collection = owned({ "🍟": 5, "🦄": 1 });
    sortCollection(collection);
    expect(Object.keys(collection)).toEqual(["🍟", "🦄"]);
  });
});

describe("rarityStats", () => {
  it("counts distinct emojis per rarity", () => {
    const stats = rarityStats(sortCollection(owned({ "🍟": 5, "🍺": 1, "🦄": 2 })));
    expect(stats.find(({ id }) => id === "common")?.collected).toBe(2);
    expect(stats.find(({ id }) => id === "mythic")?.collected).toBe(1);
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
    expect(totalDrops(sortCollection(owned({ "🍟": 5, "🦄": 2 })))).toBe(7);
  });
});

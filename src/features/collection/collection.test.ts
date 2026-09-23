import { describe, expect, it } from "vitest";
import { rarityStats, sortCollection } from "./collection";

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
});

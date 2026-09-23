import { describe, expect, it } from "vitest";
import { createInitialState, gameReducer } from "./gameReducer";

const T0 = "2026-01-01T00:00:00.000Z";
const T1 = "2026-02-02T00:00:00.000Z";

const initial = createInitialState(
  {
    selected: "🍟",
    clicks: 0,
    collection: { "🍟": { count: 1, firstFoundAt: T0 } },
    pity: { legendary: 10, epic: 10 },
  },
  2,
);

describe("gameReducer", () => {
  it("counts pushes and clicks", () => {
    const state = gameReducer(initial, { type: "push" });
    expect(state).toMatchObject({ pushes: 1, clicks: 1, phase: "idle" });
  });

  it("starts dropping once enough pushes are made", () => {
    const state = gameReducer(gameReducer(initial, { type: "push" }), { type: "push" });
    expect(state).toMatchObject({ pushes: 2, phase: "dropping" });
  });

  it.each(["dropping", "revealing"] as const)("ignores pushes while %s", (phase) => {
    const busy = { ...initial, phase };
    expect(gameReducer(busy, { type: "push" })).toBe(busy);
  });

  it("becomes pushable again once the new emoji is revealed", () => {
    const revealing = { ...initial, phase: "revealing" as const };
    expect(gameReducer(revealing, { type: "revealed" }).phase).toBe("idle");
    expect(gameReducer(initial, { type: "revealed" })).toBe(initial);
  });

  it("adds the dropped emoji, selects it and resets the counter", () => {
    const dropping = { ...initial, pushes: 2, phase: "dropping" as const };
    const state = gameReducer(dropping, { type: "drop", emoji: "🦄", pushesNeeded: 5, at: T1 });
    expect(state).toMatchObject({
      phase: "revealing",
      pushes: 0,
      pushesNeeded: 5,
      selected: "🦄",
      lastDrop: { id: 1, emoji: "🦄", isNew: true },
      collection: {
        "🍟": { count: 1, firstFoundAt: T0 },
        "🦄": { count: 1, firstFoundAt: T1 },
      },
    });
  });

  it("advances the pity counters", () => {
    expect(
      gameReducer(initial, { type: "drop", emoji: "🍔", pushesNeeded: 5, at: T1 }).pity,
    ).toEqual({
      legendary: 11,
      epic: 11,
    });
    expect(
      gameReducer(initial, { type: "drop", emoji: "👻", pushesNeeded: 5, at: T1 }).pity,
    ).toEqual({
      legendary: 11,
      epic: 0,
    });
  });

  it("increments duplicates", () => {
    const state = gameReducer(initial, { type: "drop", emoji: "🍟", pushesNeeded: 5, at: T1 });
    // Duplicates keep the first-found time.
    expect(state.collection).toEqual({ "🍟": { count: 2, firstFoundAt: T0 } });
    expect(state.lastDrop).toEqual({ id: 1, emoji: "🍟", isNew: false });
  });

  it("only selects owned emojis", () => {
    expect(gameReducer(initial, { type: "select", emoji: "🦄" })).toBe(initial);
    const owned = {
      ...initial,
      collection: { ...initial.collection, "🦄": { count: 1, firstFoundAt: T1 } },
    };
    expect(gameReducer(owned, { type: "select", emoji: "🦄" }).selected).toBe("🦄");
  });
});

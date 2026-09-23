import { describe, expect, it } from "vitest";
import { createInitialState, gameReducer } from "./gameReducer";

const initial = createInitialState({ selected: "🍟", clicks: 0, collection: { "🍟": 1 } }, 2);

describe("gameReducer", () => {
  it("counts pushes and clicks", () => {
    const state = gameReducer(initial, { type: "push" });
    expect(state).toMatchObject({ pushes: 1, clicks: 1, phase: "idle" });
  });

  it("starts dropping once enough pushes are made", () => {
    const state = gameReducer(gameReducer(initial, { type: "push" }), { type: "push" });
    expect(state).toMatchObject({ pushes: 2, phase: "dropping" });
  });

  it("ignores pushes while dropping", () => {
    const dropping = { ...initial, phase: "dropping" as const };
    expect(gameReducer(dropping, { type: "push" })).toBe(dropping);
  });

  it("adds the dropped emoji, selects it and resets the counter", () => {
    const dropping = { ...initial, pushes: 2, phase: "dropping" as const };
    const state = gameReducer(dropping, { type: "drop", emoji: "🦄", pushesNeeded: 5 });
    expect(state).toMatchObject({
      phase: "idle",
      pushes: 0,
      pushesNeeded: 5,
      selected: "🦄",
      lastDrop: { id: 1, emoji: "🦄", isNew: true },
      collection: { "🍟": 1, "🦄": 1 },
    });
  });

  it("increments duplicates", () => {
    const state = gameReducer(initial, { type: "drop", emoji: "🍟", pushesNeeded: 5 });
    expect(state.collection).toEqual({ "🍟": 2 });
    expect(state.lastDrop).toEqual({ id: 1, emoji: "🍟", isNew: false });
  });

  it("only selects owned emojis", () => {
    expect(gameReducer(initial, { type: "select", emoji: "🦄" })).toBe(initial);
    const owned = { ...initial, collection: { "🍟": 1, "🦄": 1 } };
    expect(gameReducer(owned, { type: "select", emoji: "🦄" }).selected).toBe("🦄");
  });
});

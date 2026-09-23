import type { Emoji } from "./emojis";
import type { Collection, SaveData } from "./save";

export type GameState = SaveData & {
  /** Pushes since the last drop. */
  pushes: number;
  /** Pushes required for the next drop. */
  pushesNeeded: number;
  /** `dropping` while the poo animation plays; pushes are ignored meanwhile. */
  phase: "idle" | "dropping";
  /** The emoji from the most recent drop, for highlighting. */
  lastDrop: Emoji | null;
};

export type GameAction =
  | { type: "push" }
  | { type: "drop"; emoji: Emoji; pushesNeeded: number }
  | { type: "select"; emoji: Emoji };

export const createInitialState = (save: SaveData, pushesNeeded: number): GameState => ({
  ...save,
  pushes: 0,
  pushesNeeded,
  phase: "idle",
  lastDrop: null,
});

const addToCollection = (collection: Collection, emoji: Emoji): Collection => ({
  ...collection,
  [emoji]: (collection[emoji] ?? 0) + 1,
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "push": {
      if (state.phase === "dropping") return state;
      const pushes = state.pushes + 1;
      return {
        ...state,
        pushes,
        clicks: state.clicks + 1,
        phase: pushes >= state.pushesNeeded ? "dropping" : "idle",
      };
    }
    case "drop":
      return {
        ...state,
        phase: "idle",
        pushes: 0,
        pushesNeeded: action.pushesNeeded,
        selected: action.emoji,
        lastDrop: action.emoji,
        collection: addToCollection(state.collection, action.emoji),
      };
    case "select":
      if (!state.collection[action.emoji]) return state;
      return { ...state, selected: action.emoji };
  }
};

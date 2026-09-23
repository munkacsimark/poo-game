import type { Emoji } from "./emojis";
import type { Collection, SaveData } from "./save";

export type Drop = { id: number; emoji: Emoji; isNew: boolean };

export type GameState = SaveData & {
  /** Pushes since the last drop. */
  pushes: number;
  /** Pushes required for the next drop. */
  pushesNeeded: number;
  /** `dropping` while the poo animation plays; pushes are ignored meanwhile. */
  phase: "idle" | "dropping";
  /** The most recent drop this session; `id` increases with every drop. */
  lastDrop: Drop | null;
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
        lastDrop: {
          id: (state.lastDrop?.id ?? 0) + 1,
          emoji: action.emoji,
          isNew: !state.collection[action.emoji],
        },
        collection: addToCollection(state.collection, action.emoji),
      };
    case "select":
      if (!state.collection[action.emoji]) return state;
      return { ...state, selected: action.emoji };
  }
};

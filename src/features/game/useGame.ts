import { useEffect, useEffectEvent, useReducer, useRef } from "react";
import { vibrate } from "../../shared/lib/haptics";
import type { Emoji } from "./emojis";
import { pityFloor } from "./pity";
import { createInitialState, gameReducer, type GameState } from "./gameReducer";
import { rollEmoji, rollPushesNeeded } from "./roll";
import type { SaveData } from "./save";
import { useFartSound } from "./sounds";

/** Must match the length of the poo drop animation. */
const DROP_DURATION_MS = 2000;
/** Covers the new emoji's pop-in and the stage photo's blur-out (StageBackground). */
const REVEAL_DURATION_MS = 800;

type Options = {
  /** Progress to start from; read once, so remount (e.g. with a `key`) to load another save. */
  save: SaveData;
  /** Called whenever the progress to persist changes. */
  onSave: (save: SaveData) => void;
  muted: boolean;
};

export const useGame = ({ save, onSave, muted }: Options) => {
  const [state, dispatch] = useReducer(gameReducer, save, (initial: SaveData): GameState =>
    createInitialState(initial, rollPushesNeeded()),
  );
  const playFart = useFartSound();
  const timer = useRef<number>(undefined);

  const persist = useEffectEvent(onSave);
  const { selected, clicks, collection, pity } = state;
  useEffect(() => {
    persist({ selected, clicks, collection, pity });
  }, [selected, clicks, collection, pity]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const push = () => {
    if (state.phase !== "idle") return;
    if (!muted) playFart();
    dispatch({ type: "push" });

    if (state.pushes + 1 >= state.pushesNeeded) {
      const emoji = rollEmoji({ exclude: state.selected, floor: pityFloor(state.pity) });
      timer.current = window.setTimeout(() => {
        dispatch({
          type: "drop",
          emoji,
          pushesNeeded: rollPushesNeeded(),
          at: new Date().toISOString(),
        });
        vibrate([40, 30, 80]);
        timer.current = window.setTimeout(() => dispatch({ type: "revealed" }), REVEAL_DURATION_MS);
      }, DROP_DURATION_MS);
    }
  };

  const select = (emoji: Emoji) => dispatch({ type: "select", emoji });

  return { state, push, select };
};

import { useEffect, useReducer, useRef } from "react";
import { vibrate } from "../../shared/lib/haptics";
import type { Emoji } from "./emojis";
import { INITIAL_PITY, pityFloor } from "./pity";
import { createInitialState, gameReducer, type GameState } from "./gameReducer";
import { rollCommonEmoji, rollEmoji, rollPushesNeeded } from "./roll";
import { loadSave, writeSave } from "./save";
import { useFartSound } from "./sounds";

/** Must match the length of the poo drop animation. */
const DROP_DURATION_MS = 2000;
/** Covers the new emoji's pop-in and the stage photo's blur-out (StageBackground). */
const REVEAL_DURATION_MS = 800;

const init = (): GameState => {
  const starter = rollCommonEmoji();
  const save = loadSave() ?? {
    selected: starter,
    clicks: 0,
    collection: { [starter]: 1 },
    pity: INITIAL_PITY,
  };
  return createInitialState(save, rollPushesNeeded());
};

export const useGame = ({ muted }: { muted: boolean }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);
  const playFart = useFartSound();
  const timer = useRef<number>(undefined);

  const { selected, clicks, collection, pity } = state;
  useEffect(() => {
    writeSave({ selected, clicks, collection, pity });
  }, [selected, clicks, collection, pity]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const push = () => {
    if (state.phase !== "idle") return;
    if (!muted) playFart();
    dispatch({ type: "push" });

    if (state.pushes + 1 >= state.pushesNeeded) {
      const emoji = rollEmoji({ exclude: state.selected, floor: pityFloor(state.pity) });
      timer.current = window.setTimeout(() => {
        dispatch({ type: "drop", emoji, pushesNeeded: rollPushesNeeded() });
        vibrate([40, 30, 80]);
        timer.current = window.setTimeout(() => dispatch({ type: "revealed" }), REVEAL_DURATION_MS);
      }, DROP_DURATION_MS);
    }
  };

  const select = (emoji: Emoji) => dispatch({ type: "select", emoji });

  return { state, push, select };
};

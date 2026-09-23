import { useEffect, useReducer, useRef } from "react";
import type { Emoji } from "./emojis";
import { createInitialState, gameReducer, type GameState } from "./gameReducer";
import { rollCommonEmoji, rollEmoji, rollPushesNeeded } from "./roll";
import { loadSave, writeSave } from "./save";
import { useFartSound } from "./sounds";

/** Must match the length of the poo drop animation. */
const DROP_DURATION_MS = 2000;

const init = (): GameState => {
  const starter = rollCommonEmoji();
  const save = loadSave() ?? { selected: starter, clicks: 0, collection: { [starter]: 1 } };
  return createInitialState(save, rollPushesNeeded());
};

export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);
  const playFart = useFartSound();
  const dropTimer = useRef<number>(undefined);

  const { selected, clicks, collection } = state;
  useEffect(() => {
    writeSave({ selected, clicks, collection });
  }, [selected, clicks, collection]);

  useEffect(() => () => window.clearTimeout(dropTimer.current), []);

  const push = () => {
    if (state.phase === "dropping") return;
    playFart();
    dispatch({ type: "push" });

    if (state.pushes + 1 >= state.pushesNeeded) {
      const emoji = rollEmoji(state.selected);
      dropTimer.current = window.setTimeout(() => {
        dispatch({ type: "drop", emoji, pushesNeeded: rollPushesNeeded() });
      }, DROP_DURATION_MS);
    }
  };

  const select = (emoji: Emoji) => dispatch({ type: "select", emoji });

  return { state, push, select };
};

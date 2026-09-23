import { useRef } from "react";
import { prefersReducedMotion } from "../../../shared/lib/motion";
import { getRarity, type Emoji } from "../emojis";
import type { Drop } from "../gameReducer";
import { RARITIES, RARITY_CLASS } from "../rarity";
import { DropToast } from "./DropToast";
import { StageBackground } from "./StageBackground";

type Props = {
  emoji: Emoji;
  dropping: boolean;
  lastDrop: Drop | null;
  showHint: boolean;
  onPush: () => void;
};

export const PooButton = ({ emoji, dropping, lastDrop, showHint, onPush }: Props) => {
  const emojiRef = useRef<HTMLSpanElement>(null);
  const rarity = getRarity(emoji);
  const label = RARITIES.find(({ id }) => id === rarity)?.label;

  const handleClick = () => {
    onPush();
    if (prefersReducedMotion()) return;
    emojiRef.current?.animate(
      [
        { transform: "scale(0.82, 0.78)" },
        { transform: "scale(1.06, 1.04)" },
        { transform: "none" },
      ],
      { duration: 260, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  };

  return (
    <div className={`${RARITY_CLASS[rarity]} relative flex flex-col items-center gap-3`}>
      <DropToast drop={lastDrop} />
      <div className="relative grid w-full place-items-center">
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Push the ${emoji}`}
          className="group relative isolate grid aspect-[1/0.85] w-[min(100%,26rem,56dvh)] cursor-pointer touch-manipulation place-items-center overflow-hidden rounded-[2.5rem] glass outline-none select-none focus-visible:ring-4 focus-visible:ring-(--rarity)/60 sm:aspect-square lg:w-[min(100%,32rem,70dvh)]"
        >
          <StageBackground emoji={emoji} />
          {/* Keyed so the pop-in and shine animations replay whenever the emoji changes. */}
          <span
            key={emoji}
            ref={emojiRef}
            aria-hidden
            className="[animation:var(--animate-pop-in),var(--animate-shine)] rounded-[2rem] bg-[linear-gradient(45deg,transparent_45%,color-mix(in_oklch,var(--rarity)_60%,transparent)_50%,transparent_52%,color-mix(in_oklch,var(--rarity)_60%,transparent)_55%,transparent_60%)] bg-size-[230%_230%] bg-position-[0%_100%] px-4 font-emoji text-[clamp(7rem,40vw,13rem)] leading-none drop-shadow-[0_12px_32px_color-mix(in_oklch,var(--rarity)_45%,transparent)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
          >
            {emoji}
          </span>
          {dropping && (
            <span
              aria-hidden
              className="absolute bottom-[12%] animate-drop font-emoji text-[clamp(3rem,14vw,5rem)]"
            >
              💩
            </span>
          )}
        </button>
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-5 text-sm text-white/60 transition-opacity duration-500 ${showHint && !dropping ? "opacity-100" : "opacity-0"}`}
        >
          Keep tapping to make it poop!
        </span>
      </div>

      <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-(--rarity) uppercase">
        <span className="size-2 rounded-full bg-(--rarity) shadow-[0_0_12px_var(--rarity)]" />
        {label}
      </p>
    </div>
  );
};

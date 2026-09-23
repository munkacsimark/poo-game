import { useRef, useState, type PointerEvent } from "react";
import { prefersReducedMotion } from "../../../shared/lib/motion";
import { getRarity, type Emoji } from "../emojis";
import type { Drop } from "../gameReducer";
import { RARITIES, RARITY_CLASS } from "../rarity";
import { DropBurst } from "./DropBurst";
import { DropToast } from "./DropToast";
import { StageBackground } from "./StageBackground";

type Props = {
  emoji: Emoji;
  dropping: boolean;
  /** True while the poo drops and the new emoji animates in; taps are ignored meanwhile. */
  locked: boolean;
  lastDrop: Drop | null;
  showHint: boolean;
  onPush: () => void;
};

export const PooButton = ({ emoji, dropping, locked, lastDrop, showHint, onPush }: Props) => {
  const emojiRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextRippleId = useRef(0);
  const rarity = getRarity(emoji);
  const label = RARITIES.find(({ id }) => id === rarity)?.label;

  // A ripple spreads from wherever the pointer hits the stage.
  const addRipple = (event: PointerEvent<HTMLButtonElement>) => {
    if (locked) return;
    const box = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: nextRippleId.current++,
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    };
    setRipples((current) => [...current.slice(-5), ripple]);
  };

  const handleClick = () => {
    if (locked) return;
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
          onPointerDown={addRipple}
          // aria-disabled instead of disabled so keyboard focus stays on the button.
          aria-disabled={locked}
          aria-label={`Push the ${emoji}`}
          className="group relative isolate grid aspect-[1/0.85] w-[min(100%,26rem,56dvh)] cursor-pointer touch-manipulation place-items-center overflow-hidden rounded-[2.5rem] glass outline-none select-none focus-visible:ring-4 focus-visible:ring-(--rarity)/60 aria-disabled:cursor-default sm:aspect-square lg:w-[min(100%,32rem,70dvh)]"
        >
          <StageBackground emoji={emoji} />
          {ripples.map(({ id, x, y }) => (
            <span
              key={id}
              aria-hidden
              style={{ left: x, top: y }}
              onAnimationEnd={() => setRipples((current) => current.filter((r) => r.id !== id))}
              className="pointer-events-none absolute -mt-40 -ml-40 size-80 animate-ripple rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--rarity)_45%,transparent),transparent_70%)]"
            />
          ))}
          {/* Bobs gently while idle; holds still while the poo drops. */}
          <span
            aria-hidden
            className={`animate-float ${locked ? "[animation-play-state:paused]" : ""}`}
          >
            {/* Keyed so the pop-in and shine animations replay whenever the emoji changes. */}
            <span
              key={emoji}
              ref={emojiRef}
              aria-hidden
              className="inline-block [animation:var(--animate-pop-in),var(--animate-shine)] rounded-[2rem] bg-[linear-gradient(45deg,transparent_45%,color-mix(in_oklch,var(--rarity)_60%,transparent)_50%,transparent_52%,color-mix(in_oklch,var(--rarity)_60%,transparent)_55%,transparent_60%)] bg-size-[230%_230%] bg-position-[0%_100%] px-4 font-emoji text-[clamp(7rem,40vw,13rem)] leading-none drop-shadow-[0_12px_32px_color-mix(in_oklch,var(--rarity)_45%,transparent)] transition-transform duration-300 group-aria-[disabled=false]:group-hover:scale-105 group-aria-[disabled=false]:group-active:scale-95"
            >
              {emoji}
            </span>
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
        {lastDrop && <DropBurst key={lastDrop.id} drop={lastDrop} />}
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-5 text-sm text-white/60 transition-opacity duration-500 ${showHint && !locked ? "opacity-100" : "opacity-0"}`}
        >
          Keep tapping to make it poop!
        </span>
      </div>

      <p
        key={rarity}
        className="flex animate-rise-in items-center gap-2 text-sm font-semibold tracking-wide text-(--rarity) uppercase"
      >
        <span className="size-2 rounded-full bg-(--rarity) shadow-[0_0_12px_var(--rarity)]" />
        {label}
      </p>
    </div>
  );
};

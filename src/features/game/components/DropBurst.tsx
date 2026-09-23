import type { CSSProperties } from "react";
import { getRarity } from "../emojis";
import type { Drop } from "../gameReducer";
import { rarityRank } from "../rarity";

const PARTICLES = 18;

/** Epic or rarer drops get a particle burst; Legendary or rarer add a shockwave ring. */
const celebrates = (drop: Drop) => rarityRank(getRarity(drop.emoji)) <= rarityRank("epic");
const shockwave = (drop: Drop) => rarityRank(getRarity(drop.emoji)) <= rarityRank("legendary");

/**
 * Sparkles bursting out of the stage when a rare emoji drops. Positions are derived from the
 * drop id (rendering stays pure), so each drop looks a little different. Keyed by the parent.
 */
export const DropBurst = ({ drop }: { drop: Drop }) => {
  if (!celebrates(drop)) return null;
  const spin = (drop.id * 47) % 360;

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {shockwave(drop) && (
        <span className="absolute size-1/2 animate-shockwave rounded-full border-4 border-(--rarity) shadow-[0_0_40px_var(--rarity)]" />
      )}
      {Array.from({ length: PARTICLES }, (_, index) => {
        const angle = ((index / PARTICLES) * 360 + spin) * (Math.PI / 180);
        const distance = 8 + ((index * 53 + drop.id * 17) % 7);
        const style = {
          "--dx": `${(Math.cos(angle) * distance).toFixed(2)}rem`,
          "--dy": `${(Math.sin(angle) * distance).toFixed(2)}rem`,
          animationDelay: `${(index % 3) * 40}ms`,
        } as CSSProperties;
        return index % 3 === 0 ? (
          <span key={index} style={style} className="absolute animate-burst font-emoji text-2xl">
            ✨
          </span>
        ) : (
          <span
            key={index}
            style={style}
            className="absolute size-2.5 animate-burst rounded-full bg-(--rarity) shadow-[0_0_12px_var(--rarity)]"
          />
        );
      })}
    </span>
  );
};

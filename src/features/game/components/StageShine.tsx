import type { Emoji } from "../emojis";
import type { Rarity } from "../rarity";

/** Rotating light rays behind the emoji: none for everyday tiers, stronger the rarer it is. */
const RAYS_OPACITY = {
  common: "opacity-0",
  uncommon: "opacity-0",
  rare: "opacity-30",
  epic: "opacity-40",
  legendary: "opacity-55",
  mythic: "opacity-60",
  galaxyOpal: "opacity-70",
} as const satisfies Record<Rarity, string>;

const sweepGradient =
  "bg-[linear-gradient(105deg,transparent_20%,color-mix(in_oklch,var(--rarity)_35%,white)_45%,white_50%,color-mix(in_oklch,var(--rarity)_35%,white)_55%,transparent_80%)]";

/**
 * Light behind the stage emoji, over the photo: a soft sweep whenever the emoji changes, a
 * fainter glint every few seconds, and rarity-colored rays for Rare and up. Everything sits
 * below the emoji (negative z-index inside the stage's isolated stacking context) and is
 * screen-blended onto the photo, so it reads as light rather than a painted shape.
 */
export const StageShine = ({ emoji, rarity }: { emoji: Emoji; rarity: Rarity }) => (
  <span aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
    <span
      className={`absolute top-1/2 left-1/2 size-[170%] -translate-1/2 animate-rays mix-blend-screen transition-opacity duration-1000 ${RAYS_OPACITY[rarity]} bg-[repeating-conic-gradient(from_0deg,color-mix(in_oklch,var(--rarity)_70%,white)_0deg,transparent_11.25deg,color-mix(in_oklch,var(--rarity)_70%,white)_22.5deg)] mask-radial-from-0% mask-radial-to-60% blur-[3px]`}
    />
    {/* Keyed so the sweep replays for every new emoji. */}
    <span
      key={emoji}
      className={`absolute inset-y-0 -left-full w-full animate-shine-sweep opacity-70 mix-blend-screen blur-md ${sweepGradient}`}
    />
    <span
      className={`absolute inset-y-0 -left-full w-full animate-shine-idle opacity-30 mix-blend-screen blur-lg ${sweepGradient}`}
    />
  </span>
);

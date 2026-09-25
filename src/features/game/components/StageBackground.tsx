import { useEffect, useRef, useState } from "react";
import avifSrcset from "../assets/stage-background.jpg?w=480;800;1200;1600&format=avif&quality=55&as=srcset";
import placeholder from "../assets/stage-background.jpg?w=32&format=webp&quality=40&inline";
import webpSrcset from "../assets/stage-background.jpg?w=480;800;1200;1600&format=webp&quality=70&as=srcset";
import fallback from "../assets/stage-background.jpg?w=1200&quality=72&format=jpg";
import { prefersReducedMotion } from "../../../shared/lib/motion";
import type { Emoji } from "../emojis";

/** The stage is at most 26rem wide (32rem from lg), or the full width on small phones. */
const SIZES = "(min-width: 1024px) 32rem, min(100vw, 26rem)";

/**
 * Photo behind the clickable emoji. A tiny inlined placeholder shows immediately (blur-up),
 * the optimized image fades in once loaded, and the photo blurs out whenever the emoji changes.
 */
export const StageBackground = ({ emoji }: { emoji: Emoji }) => {
  const [loaded, setLoaded] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const shownEmoji = useRef(emoji);

  // Syncs a DOM animation with emoji changes; the first render is covered by the blur-up.
  useEffect(() => {
    if (shownEmoji.current === emoji) return;
    shownEmoji.current = emoji;
    if (prefersReducedMotion()) return;
    layerRef.current?.animate(
      [
        { filter: "blur(20px) brightness(1.15)", transform: "scale(1.12)" },
        { filter: "blur(0) brightness(1)", transform: "scale(1)" },
      ],
      { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [emoji]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* The theme can grade the photo (e.g. green monochrome in Terminal); see themes.css. */}
      <div className="absolute inset-0 [filter:var(--stage-filter)]">
        <div ref={layerRef} className="absolute inset-0">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
            style={{ backgroundImage: `url(${placeholder})` }}
          />
          <picture>
            <source type="image/avif" srcSet={avifSrcset} sizes={SIZES} />
            <source type="image/webp" srcSet={webpSrcset} sizes={SIZES} />
            <img
              src={fallback}
              alt=""
              decoding="async"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 size-full object-cover transition-[opacity,filter] duration-700 ease-out ${loaded ? "opacity-100 blur-none" : "opacity-0 blur-lg"}`}
            />
          </picture>
        </div>
      </div>
      {/* Keeps the emoji readable and tints the photo with the rarity color. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklch,var(--rarity)_35%,transparent),transparent_60%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-canvas/20 via-transparent to-canvas/55" />
    </div>
  );
};

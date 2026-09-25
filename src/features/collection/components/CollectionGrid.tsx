import type { Emoji } from "../../game/emojis";
import type { Drop } from "../../game/gameReducer";
import { RARITY_CLASS } from "../../game/rarity";
import type { CollectionEntry } from "../collection";

type Props = {
  entries: CollectionEntry[];
  selected: Emoji;
  /** A first-time drop gets a "new" badge. */
  lastDrop: Drop | null;
  onSelect: (emoji: Emoji) => void;
};

export const CollectionGrid = ({ entries, selected, lastDrop, onSelect }: Props) => (
  <ul
    aria-label="Your collection"
    className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2.5"
  >
    {entries.map(({ emoji, count, rarity }, index) => {
      const isNew = lastDrop?.isNew === true && lastDrop.emoji === emoji;
      return (
        // Tiles pop in staggered (capped so long collections don't wait); a newly dropped
        // emoji mounts on its own and pops in alone.
        <li
          key={emoji}
          style={{ animationDelay: `${Math.min(index, 24) * 18}ms` }}
          className={`${RARITY_CLASS[rarity]} animate-tile-in`}
        >
          <button
            type="button"
            onClick={() => onSelect(emoji)}
            aria-label={`${emoji}, ${count} collected${isNew ? ", new" : ""}`}
            aria-pressed={emoji === selected}
            className={`relative grid aspect-square w-full cursor-pointer place-items-center rounded-2xl border font-emoji text-3xl shadow-[inset_0_0_14px_-4px_var(--rarity)] transition duration-300 ease-spring outline-none hover:scale-105 hover:-rotate-6 focus-visible:ring-2 focus-visible:ring-accent active:scale-90 active:rotate-0 aria-pressed:ring-2 aria-pressed:ring-(--rarity) aria-pressed:ring-offset-2 aria-pressed:ring-offset-canvas ${rarity === "galaxyOpal" ? "animate-opal border-2 opal-border" : "border-(--rarity)/45 bg-(--rarity)/12"}`}
          >
            {emoji}
            {isNew ? (
              <span
                aria-hidden
                className="absolute -top-2 left-1/2 -translate-x-1/2 animate-pop-in rounded-pill bg-(--rarity) px-1.5 py-0.5 font-display text-[0.6rem] font-extrabold tracking-wider text-canvas uppercase shadow-[0_0_12px_var(--rarity)]"
              >
                New
              </span>
            ) : (
              <span
                key={count}
                aria-hidden
                className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 animate-bump place-items-center rounded-pill bg-fg px-1 font-display text-[0.7rem] font-bold text-canvas tabular-nums"
              >
                {count}
              </span>
            )}
          </button>
        </li>
      );
    })}
  </ul>
);

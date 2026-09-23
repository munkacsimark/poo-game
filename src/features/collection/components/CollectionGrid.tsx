import type { Emoji } from "../../game/emojis";
import { RARITY_CLASS } from "../../game/rarity";
import type { CollectionEntry } from "../collection";

type Props = {
  entries: CollectionEntry[];
  selected: Emoji;
  onSelect: (emoji: Emoji) => void;
};

export const CollectionGrid = ({ entries, selected, onSelect }: Props) => (
  <ul
    aria-label="Your collection"
    className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2.5 p-1"
  >
    {entries.map(({ emoji, count, rarity }) => (
      <li key={emoji} className={RARITY_CLASS[rarity]}>
        <button
          type="button"
          onClick={() => onSelect(emoji)}
          aria-label={`${emoji}, ${count} collected`}
          aria-pressed={emoji === selected}
          className={`relative grid aspect-square w-full cursor-pointer place-items-center rounded-2xl border font-emoji text-3xl shadow-[inset_0_0_14px_-4px_var(--rarity)] transition duration-200 outline-none hover:scale-105 hover:-rotate-6 focus-visible:ring-2 focus-visible:ring-white aria-pressed:ring-2 aria-pressed:ring-(--rarity) aria-pressed:ring-offset-2 aria-pressed:ring-offset-ink ${rarity === "galaxyOpal" ? "animate-opal border-2 opal-border" : "border-(--rarity)/45 bg-(--rarity)/12"}`}
        >
          {emoji}
          <span
            aria-hidden
            className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 font-display text-[0.7rem] font-bold text-ink tabular-nums"
          >
            {count}
          </span>
        </button>
      </li>
    ))}
  </ul>
);

import type { Emoji } from "../../game/emojis";
import type { CollectionEntry, RarityStat } from "../collection";
import { CollectionGrid } from "./CollectionGrid";
import { CollectionStats } from "./CollectionStats";

type Props = {
  entries: CollectionEntry[];
  stats: RarityStat[];
  selected: Emoji;
  onSelect: (emoji: Emoji) => void;
};

export const CollectionPanel = ({ entries, stats, selected, onSelect }: Props) => (
  <section
    aria-labelledby="collection-heading"
    className="flex flex-col gap-4 rounded-3xl glass p-4 sm:p-5 lg:max-h-[calc(100dvh-8rem)]"
  >
    <header className="flex items-baseline justify-between gap-2">
      <h2 id="collection-heading" className="text-xl font-bold">
        Collection
      </h2>
      <p className="text-sm text-white/60 tabular-nums">{entries.length} found</p>
    </header>
    <CollectionStats stats={stats} />
    <div className="-mx-1 overflow-y-auto overscroll-contain px-1 pt-1.5">
      <CollectionGrid entries={entries} selected={selected} onSelect={onSelect} />
    </div>
  </section>
);

import { useState } from "react";
import type { Emoji } from "../../game/emojis";
import type { Drop } from "../../game/gameReducer";
import { RARITIES, type Rarity } from "../../game/rarity";
import { rarityStats, TOTAL_EMOJIS, totalDrops, type CollectionEntry } from "../collection";
import { CollectionGrid } from "./CollectionGrid";
import { RarityFilter } from "./RarityFilter";

type Props = {
  entries: CollectionEntry[];
  selected: Emoji;
  lastDrop: Drop | null;
  onSelect: (emoji: Emoji) => void;
};

const numberFormat = new Intl.NumberFormat();

export const CollectionPanel = ({ entries, selected, lastDrop, onSelect }: Props) => {
  const [filter, setFilter] = useState<Rarity | null>(null);
  const visible = filter ? entries.filter(({ rarity }) => rarity === filter) : entries;
  const drops = totalDrops(entries);
  const filterLabel = RARITIES.find(({ id }) => id === filter)?.label;

  return (
    <section
      aria-labelledby="collection-heading"
      className="flex flex-col gap-4 rounded-3xl glass p-4 sm:p-5 lg:max-h-[calc(100dvh-8rem)]"
    >
      <header className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="collection-heading" className="text-xl font-bold">
            Collection
          </h2>
          <p className="text-sm text-muted tabular-nums">
            <span className="font-semibold text-fg">{entries.length}</span> / {TOTAL_EMOJIS} found ·{" "}
            {numberFormat.format(drops)} {drops === 1 ? "drop" : "drops"}
          </p>
        </div>
        <progress
          aria-label="Collection progress"
          value={entries.length}
          max={TOTAL_EMOJIS}
          className="h-1.5 w-full appearance-none overflow-hidden rounded-pill bg-fg/10 [&::-moz-progress-bar]:animate-sheen [&::-moz-progress-bar]:bg-linear-to-r [&::-moz-progress-bar]:from-epic [&::-moz-progress-bar]:to-legendary [&::-moz-progress-bar]:bg-size-[200%_100%] [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:animate-sheen [&::-webkit-progress-value]:rounded-pill [&::-webkit-progress-value]:bg-linear-to-r [&::-webkit-progress-value]:from-epic [&::-webkit-progress-value]:via-galaxy-opal [&::-webkit-progress-value]:to-legendary [&::-webkit-progress-value]:bg-size-[200%_100%] [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-700"
        />
      </header>

      <RarityFilter stats={rarityStats(entries)} active={filter} onChange={setFilter} />

      {/*
        Scrolls on large screens. A scroll container clips its overflow, so it gets 0.75rem of
        inner room (cancelled by negative margins) for hovered tiles, rings and badges. The
        bottom padding doubles as a soft fade where the grid scrolls.
      */}
      <div className="-mx-3 -mb-3 overflow-y-auto overscroll-contain mask-b-from-[calc(100%-0.75rem)] px-3 pt-2.5 pb-3">
        {visible.length > 0 ? (
          <CollectionGrid
            // Remount per filter so the tiles replay their staggered entrance.
            key={filter ?? "all"}
            entries={visible}
            selected={selected}
            lastDrop={lastDrop}
            onSelect={onSelect}
          />
        ) : (
          <p key={filter} className="animate-rise-in py-6 text-center text-sm text-muted">
            No {filterLabel} emojis yet. Keep pushing!
          </p>
        )}
      </div>
    </section>
  );
};

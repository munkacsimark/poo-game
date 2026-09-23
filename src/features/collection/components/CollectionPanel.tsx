import { useState } from "react";
import type { Emoji } from "../../game/emojis";
import { RARITIES, type Rarity } from "../../game/rarity";
import { rarityStats, TOTAL_EMOJIS, totalDrops, type CollectionEntry } from "../collection";
import { CollectionGrid } from "./CollectionGrid";
import { RarityFilter } from "./RarityFilter";

type Props = {
  entries: CollectionEntry[];
  selected: Emoji;
  lastDrop: Emoji | null;
  onSelect: (emoji: Emoji) => void;
};

const numberFormat = new Intl.NumberFormat();

export const CollectionPanel = ({ entries, selected, lastDrop, onSelect }: Props) => {
  const [filter, setFilter] = useState<Rarity | null>(null);
  const visible = filter ? entries.filter(({ rarity }) => rarity === filter) : entries;
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
          <p className="text-sm text-white/60 tabular-nums">
            <span className="font-semibold text-white">{entries.length}</span> / {TOTAL_EMOJIS}{" "}
            found · {numberFormat.format(totalDrops(entries))} drops
          </p>
        </div>
        <progress
          aria-label="Collection progress"
          value={entries.length}
          max={TOTAL_EMOJIS}
          className="h-1.5 w-full appearance-none overflow-hidden rounded-full bg-white/10 [&::-moz-progress-bar]:bg-linear-to-r [&::-moz-progress-bar]:from-epic [&::-moz-progress-bar]:to-legendary [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-linear-to-r [&::-webkit-progress-value]:from-epic [&::-webkit-progress-value]:via-galaxy-opal [&::-webkit-progress-value]:to-legendary [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-700"
        />
      </header>

      <RarityFilter stats={rarityStats(entries)} active={filter} onChange={setFilter} />

      <div className="-mx-1 overflow-y-auto overscroll-contain px-1 pt-1.5">
        {visible.length > 0 ? (
          <CollectionGrid
            entries={visible}
            selected={selected}
            lastDrop={lastDrop}
            onSelect={onSelect}
          />
        ) : (
          <p className="py-6 text-center text-sm text-white/50">
            No {filterLabel} emojis yet. Keep pushing!
          </p>
        )}
      </div>
    </section>
  );
};

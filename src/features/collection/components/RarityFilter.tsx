import { RARITY_CLASS, type Rarity } from "../../game/rarity";
import type { RarityStat } from "../collection";

type Props = {
  stats: RarityStat[];
  active: Rarity | null;
  onChange: (rarity: Rarity | null) => void;
};

/** Per-rarity progress chips that double as a filter for the grid. */
export const RarityFilter = ({ stats, active, onChange }: Props) => (
  <fieldset className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0">
    <legend className="sr-only">Filter by rarity</legend>
    {stats.map(({ id, label, collected, total }) => (
      <button
        key={id}
        type="button"
        aria-pressed={active === id}
        aria-label={`${label}: ${collected} of ${total}`}
        onClick={() => onChange(active === id ? null : id)}
        className={`${RARITY_CLASS[id]} flex cursor-pointer items-center gap-1.5 rounded-full border border-(--rarity)/30 bg-(--rarity)/10 px-2.5 py-1 text-xs transition outline-none hover:bg-(--rarity)/20 focus-visible:ring-2 focus-visible:ring-white aria-pressed:border-(--rarity) aria-pressed:bg-(--rarity)/25 ${collected === total ? "shadow-[0_0_12px_-2px_var(--rarity)]" : ""}`}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-(--rarity)" />
        <span className="text-(--rarity)">{label}</span>
        <span className="font-semibold tabular-nums">
          {collected}
          <span className="text-white/40">/{total}</span>
        </span>
      </button>
    ))}
  </fieldset>
);

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
        onClick={() => onChange(active === id ? null : id)}
        className={`${RARITY_CLASS[id]} group flex cursor-pointer items-center gap-1.5 rounded-pill border border-(--rarity)/30 bg-(--rarity)/10 px-2.5 py-1 text-xs transition duration-300 ease-spring outline-none hover:bg-(--rarity)/20 focus-visible:ring-2 focus-visible:ring-accent active:scale-90 aria-pressed:border-(--rarity) aria-pressed:bg-(--rarity)/25 ${collected === total ? "shadow-[0_0_12px_-2px_var(--rarity)]" : ""}`}
      >
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-(--rarity) transition duration-300 ease-spring group-aria-pressed:scale-150 group-aria-pressed:shadow-[0_0_8px_var(--rarity)]"
        />
        <span className="text-(--rarity)">{label}</span>
        <span className="sr-only"> </span>
        <span className="font-semibold tabular-nums">
          {collected}
          <span className="text-muted">
            <span aria-hidden>/</span>
            <span className="sr-only">{" of "}</span>
            {total}
          </span>
        </span>
      </button>
    ))}
  </fieldset>
);

import { RARITY_CLASS } from "../../game/rarity";
import type { RarityStat } from "../collection";

type Props = {
  stats: RarityStat[];
};

export const CollectionStats = ({ stats }: Props) => (
  <dl className="flex flex-wrap gap-2">
    {stats.map(({ id, label, collected }) => (
      <div
        key={id}
        className={`${RARITY_CLASS[id]} flex items-center gap-1.5 rounded-full border border-(--rarity)/30 bg-(--rarity)/10 px-2.5 py-1 text-xs`}
      >
        <span className="size-1.5 rounded-full bg-(--rarity)" aria-hidden />
        <dt className="text-(--rarity)">{label}</dt>
        <dd className="font-semibold tabular-nums">{collected}</dd>
      </div>
    ))}
  </dl>
);

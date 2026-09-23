import { getRarity } from "../emojis";
import type { Drop } from "../gameReducer";
import { RARITIES, RARITY_CLASS } from "../rarity";

/** Announces each drop visually and to screen readers (<output> is a polite live region). */
export const DropToast = ({ drop }: { drop: Drop | null }) => {
  const rarity = drop && getRarity(drop.emoji);
  const label = RARITIES.find(({ id }) => id === rarity)?.label;

  return (
    <output className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
      {drop && rarity && (
        // Keyed by drop id so the animation replays for every drop.
        <span
          key={drop.id}
          className={`${RARITY_CLASS[rarity]} flex animate-toast items-center gap-2 rounded-full border border-(--rarity)/50 bg-ink/70 px-4 py-1.5 text-sm font-bold shadow-[0_0_24px_-4px_var(--rarity)] backdrop-blur-md`}
        >
          <span className="font-emoji">{drop.emoji}</span>
          <span className="text-(--rarity)">{drop.isNew ? `New ${label}!` : `+1 ${label}`}</span>
        </span>
      )}
    </output>
  );
};

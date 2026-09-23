import { RARITY_CLASS } from "../game/rarity";
import { dropRates, pityRules } from "./dropRates";

export const HelpButton = () => (
  <>
    <button
      type="button"
      popoverTarget="help"
      aria-label="How to play"
      className="grid size-10 cursor-pointer place-items-center rounded-full glass text-lg font-bold transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
    >
      ?
    </button>
    <div
      id="help"
      popover="auto"
      className="inset-auto top-[calc(env(safe-area-inset-top)+4.5rem)] right-4 m-0 max-h-[calc(100dvh-6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl glass bg-ink/80 p-4 text-sm text-white/90 supports-[position-area:bottom]:inset-auto supports-[position-area:bottom]:mt-2 supports-[position-area:bottom]:[position-area:bottom_span-left]"
    >
      <h2 className="mb-1 font-bold text-white">How to play</h2>
      <p>
        Tap the emoji over and over. Every so often it poops out a new one: collect them all, from
        Common up to the one-in-2,000 Galaxy Opal. Tap any emoji in your collection to show it off.
      </p>

      <h2 className="mt-4 mb-2 font-bold text-white">Drop rates</h2>
      <table className="w-full text-xs tabular-nums">
        <thead className="text-white/50">
          <tr>
            <th scope="col" className="pb-1 text-left font-medium">
              Rarity
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Chance
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Odds
            </th>
            <th scope="col" className="pb-1 text-right font-medium">
              Emojis
            </th>
          </tr>
        </thead>
        <tbody>
          {dropRates().map(({ id, label, chance, oneIn, emojis }) => (
            <tr key={id} className={`${RARITY_CLASS[id]} border-t border-white/10`}>
              <th scope="row" className="py-1 text-left font-medium text-(--rarity)">
                {label}
              </th>
              <td className="py-1 text-right">{chance}</td>
              <td className="py-1 text-right text-white/60">{oneIn}</td>
              <td className="py-1 text-right text-white/60">{emojis}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-3 list-disc space-y-0.5 pl-4 text-xs text-white/60">
        {pityRules().map((rule) => (
          <li key={rule}>{rule}.</li>
        ))}
        <li>A drop never repeats the emoji you're showing.</li>
      </ul>
    </div>
  </>
);

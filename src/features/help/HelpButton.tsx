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
      className="inset-auto top-[calc(env(safe-area-inset-top)+4.5rem)] right-4 m-0 max-w-72 rounded-2xl glass bg-ink/80 p-4 text-sm text-white/90 supports-[position-area:bottom]:inset-auto supports-[position-area:bottom]:mt-2 supports-[position-area:bottom]:[position-area:bottom_span-left]"
    >
      <p className="mb-1 font-bold text-white">How to play</p>
      Tap the emoji over and over. Every so often it poops out a new one: collect them all, from
      Common up to the one-in-233 Galaxy Opal. Tap any emoji in your collection to show it off.
    </div>
  </>
);

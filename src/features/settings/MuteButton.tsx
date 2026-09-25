type Props = {
  muted: boolean;
  onToggle: () => void;
};

export const MuteButton = ({ muted, onToggle }: Props) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label="Sound"
    aria-pressed={!muted}
    className="group grid size-10 cursor-pointer place-items-center rounded-pill glass transition duration-300 ease-spring outline-none hover:-translate-y-0.5 hover:bg-fg/15 focus-visible:ring-2 focus-visible:ring-accent active:scale-90"
  >
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
      {/* Both states stay mounted so toggling animates: waves shrink away, the cross pops in. */}
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7"
        className={`origin-[11px_12px] transition duration-300 ease-spring ${muted ? "scale-50 opacity-0" : ""}`}
      />
      <path
        d="M18.5 5.5a9 9 0 0 1 0 13"
        className={`origin-[11px_12px] transition delay-75 duration-300 ease-spring ${muted ? "scale-50 opacity-0" : ""}`}
      />
      <path
        d="m22 9-6 6m0-6 6 6"
        className={`origin-[19px_12px] transition duration-300 ease-spring ${muted ? "" : "scale-0 opacity-0"}`}
      />
    </svg>
  </button>
);

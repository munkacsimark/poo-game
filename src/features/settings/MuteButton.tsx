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
    className="grid size-10 cursor-pointer place-items-center rounded-full glass transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
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
      {muted ? (
        <path d="m22 9-6 6m0-6 6 6" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />
      )}
    </svg>
  </button>
);

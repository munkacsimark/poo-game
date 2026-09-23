import type { ReactNode } from "react";
import { MuteButton } from "../features/settings/MuteButton";

const numberFormat = new Intl.NumberFormat();

type Props = {
  clicks: number;
  muted: boolean;
  onToggleMuted: () => void;
  profileButton: ReactNode;
};

export const Header = ({ clicks, muted, onToggleMuted, profileButton }: Props) => (
  <header className="flex items-center justify-between gap-3">
    <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight whitespace-nowrap sm:text-xl">
      <span aria-hidden className="font-emoji">
        💩
      </span>
      Poo Game
    </h1>
    <div className="flex items-center gap-2">
      <p className="flex h-10 items-center gap-1.5 rounded-full glass px-3.5 text-sm">
        <span className="sr-only text-white/60 min-[400px]:not-sr-only">Taps</span>
        {/* Keyed so each tap replays the bump. */}
        <span key={clicks} className="inline-block animate-bump font-bold tabular-nums">
          {numberFormat.format(clicks)}
        </span>
      </p>
      <MuteButton muted={muted} onToggle={onToggleMuted} />
      {profileButton}
    </div>
  </header>
);

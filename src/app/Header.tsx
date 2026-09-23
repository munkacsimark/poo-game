import { HelpButton } from "../features/help/HelpButton";

const numberFormat = new Intl.NumberFormat();

export const Header = ({ clicks }: { clicks: number }) => (
  <header className="flex items-center justify-between gap-3">
    <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
      <span aria-hidden className="font-emoji">
        💩
      </span>
      Poo Game
    </h1>
    <div className="flex items-center gap-2">
      <p className="flex h-10 items-center gap-1.5 rounded-full glass px-4 text-sm">
        <span className="text-white/60">Taps</span>
        <span className="font-bold tabular-nums">{numberFormat.format(clicks)}</span>
      </p>
      <HelpButton />
    </div>
  </header>
);

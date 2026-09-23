import { Link } from "@tanstack/react-router";

/** Any URL without a route. */
export const NotFound = () => (
  <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
    <p aria-hidden className="font-emoji text-7xl">
      🧻
    </p>
    <h1 className="text-2xl font-extrabold tracking-tight">Nothing to see here</h1>
    <p className="text-white/60">This page doesn't exist.</p>
    <Link
      to="/"
      className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink transition outline-none hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white"
    >
      Back to the game
    </Link>
  </main>
);

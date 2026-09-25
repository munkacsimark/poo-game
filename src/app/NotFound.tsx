import { Link } from "@tanstack/react-router";

/** Any URL without a route. */
export const NotFound = () => (
  <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
    <p aria-hidden className="animate-float font-emoji text-7xl">
      🧻
    </p>
    <h1 className="text-2xl font-extrabold tracking-tight">Nothing to see here</h1>
    <p className="text-muted">This page doesn't exist.</p>
    <Link
      to="/"
      className="rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition duration-300 ease-spring outline-none hover:bg-accent/85 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
    >
      Back to the game
    </Link>
  </main>
);

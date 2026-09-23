import { Link } from "@tanstack/react-router";

/** The app version; links to the changelog (/changelog). */
export const VersionLink = () => (
  <Link
    to="/changelog"
    className="rounded-full px-3 py-1 text-xs text-white/40 tabular-nums transition outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
  >
    <span className="sr-only">What's new in </span>v{import.meta.env.VITE_APP_VERSION}
  </Link>
);

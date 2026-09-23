import { Link } from "@tanstack/react-router";

/** The app version; links to the changelog (/changelog). */
export const VersionLink = ({ className }: { className?: string }) => (
  <Link to="/changelog" className={`tabular-nums ${className ?? ""}`}>
    <span className="sr-only">What's new in </span>v{import.meta.env.VITE_APP_VERSION}
  </Link>
);

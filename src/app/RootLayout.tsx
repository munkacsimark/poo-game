import { Link, Outlet } from "@tanstack/react-router";
import { VersionLink } from "../features/changelog/VersionLink";
import { ProfilesProvider } from "../features/profiles/ProfilesProvider";
import { ThemeProvider } from "../features/theme/ThemeProvider";
import { Aurora } from "./Aurora";

/**
 * Footer links: glass pills with a full 44 px touch target on phones and tablets, plain text
 * links on desktop (lg), where the pointer is precise and the footer is always in view.
 */
const footerLinkClass =
  "inline-flex min-h-11 items-center rounded-pill glass px-4 text-sm font-medium text-fg/75 transition duration-300 ease-spring outline-none hover:-translate-y-0.5 hover:bg-fg/15 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent active:scale-95 lg:min-h-0 lg:border-transparent lg:bg-transparent lg:px-2 lg:py-1 lg:text-xs lg:font-normal lg:text-muted lg:underline-offset-4 lg:shadow-none lg:backdrop-filter-none lg:hover:translate-y-0 lg:hover:bg-transparent lg:hover:underline lg:active:scale-100";

/** Shell shared by every route: theme, background, safe-area layout and the footer links. */
export const RootLayout = () => (
  <ThemeProvider>
    <div className="relative isolate min-h-dvh">
      <Aurora />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        {/* Named for view transitions between screens (see "screen" in index.css). */}
        <div className="flex flex-1 flex-col gap-4 [view-transition-name:screen]">
          {/* Shows the save error screen instead of the route when stored data is unusable. */}
          <ProfilesProvider>
            <Outlet />
          </ProfilesProvider>
        </div>
        <footer className="flex items-center justify-center gap-2 pt-2 pb-1 lg:gap-0 lg:pt-0">
          <Link to="/faq" className={footerLinkClass}>
            FAQ
          </Link>
          <span aria-hidden className="hidden text-xs text-fg/25 lg:inline">
            ·
          </span>
          <Link to="/theme" className={footerLinkClass}>
            Theme
          </Link>
          <span aria-hidden className="hidden text-xs text-fg/25 lg:inline">
            ·
          </span>
          <VersionLink className={footerLinkClass} />
        </footer>
      </div>
    </div>
  </ThemeProvider>
);

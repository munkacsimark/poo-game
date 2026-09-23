import { Link, Outlet } from "@tanstack/react-router";
import { VersionLink } from "../features/changelog/VersionLink";
import { ProfilesProvider } from "../features/profiles/ProfilesProvider";
import { Aurora } from "./Aurora";

/** Shell shared by every route: background, safe-area layout and the footer links. */
export const RootLayout = () => (
  <ProfilesProvider>
    <div className="relative isolate min-h-dvh">
      <Aurora />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        {/* Named for view transitions between screens (see "screen" in index.css). */}
        <div className="flex flex-1 flex-col gap-4 [view-transition-name:screen]">
          <Outlet />
        </div>
        <footer className="flex items-center justify-center gap-1">
          <Link
            to="/faq"
            className="rounded-full px-3 py-1 text-xs text-white/40 transition outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
          >
            FAQ
          </Link>
          <span aria-hidden className="text-xs text-white/20">
            ·
          </span>
          <VersionLink />
        </footer>
      </div>
    </div>
  </ProfilesProvider>
);

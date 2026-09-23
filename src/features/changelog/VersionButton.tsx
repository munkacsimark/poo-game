import { lazy, Suspense, useState } from "react";

const ChangelogDialog = lazy(() =>
  import("./ChangelogDialog").then((module) => ({ default: module.ChangelogDialog })),
);

/** The app version; opens the changelog, whose code and data load on first click. */
export const VersionButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Version ${import.meta.env.VITE_APP_VERSION}, what's new`}
        className="cursor-pointer rounded-full px-3 py-1 text-xs text-white/40 tabular-nums transition outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
      >
        v{import.meta.env.VITE_APP_VERSION}
      </button>
      {open && (
        <Suspense>
          <ChangelogDialog onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

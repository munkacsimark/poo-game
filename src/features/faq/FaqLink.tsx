import { lazy, Suspense } from "react";
import { clearLocationHash, useLocationHash } from "../../shared/lib/useLocationHash";

const FaqDialog = lazy(() =>
  import("./FaqDialog").then((module) => ({ default: module.FaqDialog })),
);

/** A real link to "#faq": it opens the FAQ dialog, so the FAQ can be linked to directly. */
export const FaqLink = () => {
  const open = useLocationHash() === "#faq";

  return (
    <>
      <a
        href="#faq"
        aria-haspopup="dialog"
        className="rounded-full px-3 py-1 text-xs text-white/40 transition outline-none hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
      >
        FAQ
      </a>
      {open && (
        <Suspense>
          <FaqDialog onClose={clearLocationHash} />
        </Suspense>
      )}
    </>
  );
};

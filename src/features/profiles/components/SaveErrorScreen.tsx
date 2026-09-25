import { useState } from "react";
import type { ReadError } from "../saveFile";

const MESSAGES: Record<ReadError, { title: string; body: string }> = {
  outdated: {
    title: "Your saved progress is from an older version",
    body: "This version of Poo Game can't read it. You can remove it and start a new game.",
  },
  newer: {
    title: "Your saved progress is from a newer version",
    body: "Reload the page to get the latest Poo Game. If that doesn't help, you can remove the saved data and start over.",
  },
  damaged: {
    title: "Your saved progress can't be loaded",
    body: "It's damaged or was changed by hand. You can remove it and start a new game.",
  },
};

const buttonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill px-5 text-sm font-semibold transition duration-300 ease-spring outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95";

/** Shown instead of the app when the saved data can't be used; nothing is overwritten meanwhile. */
export const SaveErrorScreen = ({
  reason,
  onRemove,
}: {
  reason: ReadError;
  onRemove: () => void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const { title, body } = MESSAGES[reason];

  return (
    <main className="flex flex-1 items-center justify-center py-10">
      <section
        aria-labelledby="save-error-title"
        className="flex w-full max-w-md animate-rise-in flex-col items-center gap-4 rounded-3xl glass p-6 text-center sm:p-8"
      >
        <p aria-hidden className="animate-float font-emoji text-6xl">
          🧻
        </p>
        <h1 id="save-error-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
          {title}
        </h1>
        <p className="text-sm text-fg/70">{body}</p>

        {reason === "newer" && (
          <button
            type="button"
            onClick={() => location.reload()}
            className={`${buttonClass} bg-accent text-on-accent hover:bg-accent/85`}
          >
            Reload
          </button>
        )}

        <div className="mt-2 w-full border-t border-fg/10 pt-4">
          {confirming ? (
            <div className="flex animate-rise-in flex-col items-center gap-3">
              <p className="text-sm">
                This deletes every profile and all progress saved on this device. It can't be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={`${buttonClass} glass hover:bg-fg/15`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className={`${buttonClass} bg-red-700 text-white hover:bg-red-800`}
                >
                  Remove and start over
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={`${buttonClass} text-danger hover:bg-danger/15`}
            >
              Remove saved data
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

import { useEffect, useRef } from "react";
import changelog from "../../../CHANGELOG.md?raw";
import { parseChangelog } from "./changelog";

const releases = parseChangelog(changelog);

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** Modal list of releases, newest first. Loaded lazily by `VersionButton`. */
export const ChangelogDialog = ({ onClose }: { onClose: () => void }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Syncs with the native dialog API: open as a modal once mounted.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    // Keyboard users close the dialog with Escape or the Close button; the click handler only
    // adds backdrop dismissal for pointers.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside its content) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      aria-labelledby="changelog-title"
      className="m-auto max-h-[min(40rem,calc(100dvh-2rem))] w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-3xl glass bg-ink/90 p-0 text-white/90 backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 id="changelog-title" className="text-lg font-bold text-white">
            What's new
          </h2>
          <form method="dialog">
            <button
              type="submit"
              aria-label="Close"
              className="grid size-9 cursor-pointer place-items-center rounded-full glass text-lg transition outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span aria-hidden>×</span>
            </button>
          </form>
        </header>
        <div className="overflow-y-auto px-5 pb-5">
          {releases.map(({ version, date, groups }, index) => (
            <details
              key={version}
              open={index === 0}
              className="group border-b border-white/10 py-3 last:border-0"
            >
              <summary className="flex cursor-pointer items-baseline justify-between gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white">
                <span className="font-semibold text-white">
                  {version === "Unreleased" ? version : `v${version}`}
                </span>
                {date && (
                  <time dateTime={date} className="text-xs text-white/50">
                    {dateFormat.format(new Date(`${date}T00:00:00`))}
                  </time>
                )}
              </summary>
              {groups.map(({ title, entries }) => (
                <section key={title} className="mt-3">
                  <h3 className="mb-1 text-xs font-semibold tracking-wide text-white/50 uppercase">
                    {title}
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm marker:text-white/30">
                    {entries.map(({ scope, text }, entryIndex) => (
                      // Entries can repeat (e.g. "Add more emojis"), so the index disambiguates.
                      // oxlint-disable-next-line react/no-array-index-key
                      <li key={`${entryIndex}-${text}`}>
                        {scope && (
                          <span className="mr-1.5 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/70">
                            {scope}
                          </span>
                        )}
                        {text}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </details>
          ))}
        </div>
      </div>
    </dialog>
  );
};

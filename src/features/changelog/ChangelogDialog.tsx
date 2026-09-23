import changelog from "virtual:changelog";
import { useCloseRoute } from "../../shared/lib/useCloseRoute";
import { Modal } from "../../shared/ui/Modal";
import { parseChangelog } from "./changelog";

const releases = parseChangelog(changelog);

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** /changelog: every release, newest first, over the game. */
export const ChangelogDialog = () => (
  <Modal title="What's new" onClose={useCloseRoute("/")}>
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
  </Modal>
);

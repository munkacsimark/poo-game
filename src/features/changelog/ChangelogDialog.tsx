import changelog from "virtual:changelog";
import { useCloseRoute } from "../../shared/lib/useCloseRoute";
import { AccordionItem } from "../../shared/ui/AccordionItem";
import { Modal } from "../../shared/ui/Modal";
import { parseChangelog } from "./changelog";

const releases = parseChangelog(changelog);

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** /changelog: every release, newest first, over the game. */
export const ChangelogDialog = () => (
  <Modal title="What's new" onClose={useCloseRoute("/")}>
    {releases.map(({ version, date, groups }, index) => (
      <AccordionItem
        key={version}
        defaultOpen={index === 0}
        summary={
          <span className="flex flex-1 items-baseline justify-between gap-3">
            <span className="font-semibold text-fg">
              {version === "Unreleased" ? version : `v${version}`}
            </span>
            {date && (
              <time dateTime={date} className="text-xs text-muted">
                {dateFormat.format(new Date(`${date}T00:00:00`))}
              </time>
            )}
          </span>
        }
      >
        {groups.map(({ title, entries }) => (
          <section key={title} className="mt-3 first:mt-0">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">
              {title}
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm marker:text-fg/30">
              {entries.map(({ scope, text }, entryIndex) => (
                // Entries can repeat (e.g. "Add more emojis"), so the index disambiguates.
                // oxlint-disable-next-line react/no-array-index-key
                <li key={`${entryIndex}-${text}`}>
                  {scope && (
                    <span className="mr-1.5 rounded bg-fg/10 px-1.5 py-0.5 text-xs text-fg/70">
                      {scope}
                    </span>
                  )}
                  {text}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </AccordionItem>
    ))}
  </Modal>
);

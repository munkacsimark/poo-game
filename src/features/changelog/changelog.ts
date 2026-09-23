type ChangelogEntry = { scope?: string; text: string };
type ChangelogGroup = { title: string; entries: ChangelogEntry[] };
export type Release = {
  /** "0.1.1", or "Unreleased" for commits after the latest tag. */
  version: string;
  date?: string;
  groups: ChangelogGroup[];
};

const RELEASE = /^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?$/;
const GROUP = /^### (.+)$/;
const ENTRY = /^- (?:\*\*([^*]+):\*\* )?(.+)$/;

/**
 * Parses the CHANGELOG.md that git-cliff generates (see cliff.toml): `## [version] - date`,
 * `### Group` and `- **scope:** entry` lines. Anything else, like the header, is ignored.
 */
export const parseChangelog = (markdown: string): Release[] => {
  const releases: Release[] = [];
  for (const line of markdown.split("\n").map((raw) => raw.trim())) {
    const release = RELEASE.exec(line);
    if (release) {
      const [, version = "", date] = release;
      releases.push({ version, date, groups: [] });
      continue;
    }
    const current = releases.at(-1);
    const group = GROUP.exec(line);
    if (current && group) {
      current.groups.push({ title: group[1] ?? "", entries: [] });
      continue;
    }
    const entry = ENTRY.exec(line);
    const currentGroup = current?.groups.at(-1);
    if (currentGroup && entry) {
      const [, scope, text = ""] = entry;
      currentGroup.entries.push(scope ? { scope, text } : { text });
    }
  }
  return releases;
};

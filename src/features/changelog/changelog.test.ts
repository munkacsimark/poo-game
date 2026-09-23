import { describe, expect, it } from "vitest";
import changelog from "../../../CHANGELOG.md?raw";
import { parseChangelog } from "./changelog";

const sample = `# Changelog

Intro text with a [link](https://example.com).

## [Unreleased]

### Features

- Something new

## [0.1.1] - 2026-09-23

### Features

- **a11y:** Announce drops
- Seven rarity tiers

### Bug fixes

- Lock the stage
`;

describe("parseChangelog", () => {
  it("parses releases, groups and scoped entries", () => {
    expect(parseChangelog(sample)).toEqual([
      {
        version: "Unreleased",
        date: undefined,
        groups: [{ title: "Features", entries: [{ text: "Something new" }] }],
      },
      {
        version: "0.1.1",
        date: "2026-09-23",
        groups: [
          {
            title: "Features",
            entries: [{ scope: "a11y", text: "Announce drops" }, { text: "Seven rarity tiers" }],
          },
          { title: "Bug fixes", entries: [{ text: "Lock the stage" }] },
        ],
      },
    ]);
  });

  it("understands the generated CHANGELOG.md", () => {
    const releases = parseChangelog(changelog);
    expect(releases.at(-1)).toMatchObject({ version: "0.1.0" });
    for (const { groups } of releases) {
      for (const { entries } of groups) expect(entries.length).toBeGreaterThan(0);
    }
  });
});

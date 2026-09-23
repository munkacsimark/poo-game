/**
 * Cuts a release: bumps package.json, regenerates CHANGELOG.md from the commit history with
 * git-cliff, commits both as `chore(release): vX.Y.Z` and creates an annotated `vX.Y.Z` tag.
 * Nothing is pushed; run `git push --follow-tags` to publish.
 *
 *   pnpm release          # patch: 0.1.1 → 0.1.2
 *   pnpm release minor    # 0.1.2 → 0.2.0
 *   pnpm release 1.0.0    # explicit version
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const run = (command: string, ...args: string[]) =>
  execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

const nextVersion = (current: string, bump: string): string => {
  if (SEMVER.test(bump)) return bump;
  const [, major = 0, minor = 0, patch = 0] = (SEMVER.exec(current) ?? []).map(Number);
  switch (bump) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Unknown bump "${bump}": use patch, minor, major or x.y.z`);
  }
};

if (run("git", "status", "--porcelain") !== "") {
  throw new Error("Commit or stash your changes before releasing.");
}

const pkgPath = new URL("../package.json", import.meta.url);
const pkg: { version: string } = JSON.parse(readFileSync(pkgPath, "utf8"));
const version = nextVersion(pkg.version, process.argv[2] ?? "patch");
const tag = `v${version}`;
if (run("git", "tag", "--list", tag) !== "") throw new Error(`Tag ${tag} already exists.`);

writeFileSync(
  pkgPath,
  readFileSync(pkgPath, "utf8").replace(/"version": "[^"]+"/, `"version": "${version}"`),
);
run("pnpm", "exec", "git-cliff", "--tag", tag, "--output", "CHANGELOG.md");
run("pnpm", "exec", "oxfmt", "CHANGELOG.md", "package.json");

run("git", "add", "package.json", "CHANGELOG.md");
run("git", "commit", "--message", `chore(release): ${tag}`);
run("git", "tag", "--annotate", tag, "--message", tag);
console.log(`Released ${tag}. Publish with: git push --follow-tags`);

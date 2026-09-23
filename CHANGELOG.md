# Changelog

All notable changes to Poo Game. Generated from the commit history by
[git-cliff](https://git-cliff.org); release with `pnpm release`.

## [0.1.2] - 2026-09-23

### Features

- Seal saved progress in localStorage against casual edits
- Stable ids for every emoji
- Schema-defined, versioned save format (v2)

### Refactoring

- Share the obfuscation helpers used by profile files

### Maintenance

- Dev-only console helpers for sealed storage

## [0.1.1] - 2026-09-23

### Features

- Dark glassmorphism redesign with Tailwind CSS v4
- Add sound toggle and drop haptics
- Show collection progress and highlight new finds
- **a11y:** Announce drops and align accessible names
- Make the game an installable, offline-capable PWA
- Optimized meadow photo behind the stage emoji
- Roll drops with a cryptographically secure RNG
- Seven themed rarity tiers with published rates
- Bad-luck protection for Epic and Legendary drops
- Publish drop rates and pity rules in Help
- Show the app version in the footer and open the changelog from it
- Multiple player profiles with a "Who's playing?" picker
- Export and import profiles as tamper-resistant files
- Replace the help button with a FAQ link in the footer
- Show the collection on the left on large screens
- Route every screen and dialog with TanStack Router
- **ui:** Animate dialogs in and out
- **ui:** Smooth accordions in the FAQ and changelog
- **ui:** Blur-fade view transitions between screens
- **ui:** Make the stage feel alive
- **ui:** Animate the collection
- **ui:** Springy buttons, animated sound icon and livelier profile screens
- **ui:** Replace the stage emoji's shine with soft light and rarity rays

### Bug fixes

- Lock the stage while the poo drops and the new emoji appears
- **a11y:** Make the version and profile tiles' names contain their visible text
- Generate the in-app changelog from git at build time
- **ui:** Stop the collection from cropping hovered tiles and badges
- **ui:** Make the footer's FAQ and version links findable on phones
- **ui:** Keep the footer as plain links on desktop

### Refactoring

- Restructure into features and rewrite game state
- Start the save format fresh at v1
- Extract a shared Modal from the changelog dialog
- **ui:** Drop the repeating idle glint on the stage

### Documentation

- Add agent workflow docs, architecture guide and new README
- List profiles, luck protection, FAQ and changelog in the README

### Testing

- Add Vitest and Testing Library suites
- Add Playwright end-to-end tests

### Maintenance

- Migrate from Parcel to Vite 8, React 19 and TypeScript 7
- Add oxlint, ESLint, oxfmt, knip and lefthook
- Modernize the pipeline and deploy with GitHub Pages actions
- Remove credits footer
- Version releases with git tags and a generated changelog

## [0.1.0] - 2023-08-03

### Bug fixes

- Fix help text
- Fix poo position
- Fix
- Fix bg
- Fix ts errors
- Fix public-url

### Dependencies

- Bump follow-redirects from 1.14.6 to 1.14.7
- Bump json5 from 2.2.1 to 2.2.3

### Changes

- Initialize project using Create React App
- 🚀
- Gitlab-ci.yml added
- Typo
- Use yarn
- Fixes
- GitLab script fix
- Set homepage
- Add README.md
- Update dependencies
- Create main.yml
- Update main.yml
- Create blank.yml
- Create ghpages.yml
- Remove bad workflows
- Update readme
- Update ghpages.yml
- Dependencies
- Update gitignore
- Rarity logic
- Collected emojis listing logic
- Add more emojis
- Mobile view fix
- Refact
- Add more emojis
- Npm update
- Move to yarn
- Save state to localstorage
- Use emoji as button
- Improve audio playing
- Mobile fix
- Add stats
- Css fixes
- Can select collected emoji
- Update dependencies
- Update deps
- Update to react 18
- Use module css
- Rethink rarities
- Add new emojis
- Set limit
- Layout refact
- Block zoom on mobile
- Update deps
- Change to TS
- TS update + refact
- Sort emojis by collected
- Change to pnpm
- Removing empty test related stuff
- Switch to parcel and rome
- Use rome linter
- Update CI
- Use precommit hook

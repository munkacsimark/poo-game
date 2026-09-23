# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) and humans working on
**Poo Game**, a mobile-first emoji collecting game: tap the emoji until it poops out a new
one, and collect all 298 across seven rarities. It ships as an installable PWA on GitHub Pages at
<https://munkacsimark.github.io/poo-game/>.

This file is the single source of truth. `CLAUDE.md` imports it; deeper material lives in
[`docs/`](docs).

## Stack

| Concern         | Tool                                                                  |
| --------------- | --------------------------------------------------------------------- |
| UI              | React 19 with the React Compiler (automatic memoization)              |
| Language        | TypeScript 7 (native `tsc`), strict + `noUncheckedIndexedAccess`      |
| Build / dev     | Vite 8, served under the `/poo-game/` base path                       |
| Routing         | TanStack Router (code-based, typed), clean paths + 404.html fallback  |
| Styling         | Tailwind CSS v4; design tokens in `src/app/index.css`                 |
| PWA             | vite-plugin-pwa (Workbox, auto-update) + generated icons              |
| Unit/component  | Vitest 5 + Testing Library (jsdom)                                    |
| End-to-end      | Playwright (desktop Chrome + Pixel 7, against the production build)   |
| Lint            | oxlint (type-aware) first, ESLint only for React Compiler/Hooks rules |
| Format          | oxfmt (also sorts imports and Tailwind classes)                       |
| Dead code       | knip                                                                  |
| Git hooks       | lefthook (format, lint, typecheck on staged files)                    |
| Package manager | pnpm 10 (pinned via `packageManager`), Node ≥ 24                      |

## Commands

```sh
pnpm install          # also installs the lefthook git hooks
pnpm dev              # http://localhost:5173/poo-game/
pnpm check            # format:check + lint + typecheck + knip + unit tests; run before every commit
pnpm test:watch       # Vitest in watch mode
pnpm coverage         # unit tests with v8 coverage
pnpm e2e              # Playwright; builds and serves on :4174 automatically
pnpm build && pnpm preview   # production build incl. service worker
pnpm format           # fix formatting
pnpm release [patch|minor|major|x.y.z]   # bump, regenerate CHANGELOG.md, commit + tag (no push)
pnpm lint:fix         # auto-fix lint issues
```

## Project map

```
src/
  main.tsx                  entry: mounts <App/> in StrictMode
  app/                      router.tsx (route tree), RootLayout, GameLayout/GameScreen, Header,
                            NotFound, Aurora background, index.css (Tailwind + tokens)
  features/
    game/                   core loop
      rarity.ts             RARITIES table (id, label, weight) + RARITY_CLASS
      emojis.ts             EMOJIS_BY_RARITY data, Emoji type, getRarity/isEmoji
      roll.ts               pure RNG-injectable rolls (rarity, emoji, pushes needed)
      gameReducer.ts        pure state machine: push / drop / select
      save.ts               SaveData (one player's progress): validation + starter save
      useGame.ts            wires reducer + side effects (sound, timer, persistence, haptics)
      sounds/               mp3s + useFartSound
      assets/               stage background photo (source; optimized at build time)
      components/           PooButton (stage), StageBackground, DropToast (live region)
    profiles/               multiple profiles: reducer, versioned storage, picker + editor
    collection/             sorting/stats helpers + CollectionPanel, CollectionGrid, RarityFilter
    settings/               mute toggle (useMuted, MuteButton)
    faq/                    /faq route: lazy FaqDialog with the drop-rate table
    changelog/              footer VersionLink + /changelog route (lazy, parses virtual:changelog)
  shared/lib/               storage (never-throwing localStorage), haptics, random (crypto RNG)
  test/                     jsdom shims (setup.ts) and stubRandomWords
e2e/                        Playwright specs
docs/                       architecture and agent workflow docs
```

See [`docs/architecture.md`](docs/architecture.md) for data flow, the state machine and the save format.

## Conventions

- **Every screen and dialog is a route** (see the table in `src/app/router.tsx`), so Back,
  Forward, reload and deep links work. Navigate with `<Link>`/`useNavigate`, never local
  "open" state; dialog routes close with `useCloseRoute(fallback)`. Shared state that must
  survive route changes lives in providers under `RootLayout` (e.g. `ProfilesProvider`).

- **Keep game logic pure.** Randomness is injected (`Rng`) or rolled in `useGame` and passed
  into reducer actions; the reducer never touches randomness, timers or storage. Rolls use `secureRandom`
  (`shared/lib/random.ts`, backed by `crypto.getRandomValues`), never `Math.random`.
- **No manual memoization.** The React Compiler handles it; don't add `useMemo`/`useCallback`/`memo`
  unless a profiler proves a need. Effects are only for syncing with external systems.
- **Rarity is data.** Add or rebalance tiers in `RARITIES`/`EMOJIS_BY_RARITY`, never with
  per-rarity `if` chains. Every emoji must appear exactly once (a unit test enforces this).
- **Styling:** Tailwind utilities in JSX. Rarity colors flow through the `--rarity` CSS variable
  set by `RARITY_CLASS[rarity]`; use `text-(--rarity)`, `bg-(--rarity)/10`, etc. Never build class
  names from strings at runtime (Tailwind can't see them). New tokens/keyframes go in the
  `@theme` block of `src/app/index.css`.
- **Persisted data is versioned.** If the stored profiles or `SaveData` change shape, bump
  `PROFILES_VERSION` in `profiles/storage.ts`, migrate every older version, and add a test.
  Players must never lose progress.
- **Accessibility:** real `<button>`s, accessible names that contain the visible text,
  `aria-pressed` for toggles, decorative emoji `aria-hidden`, motion respects
  `prefers-reduced-motion`. Lighthouse accessibility must stay at 100.
- **Motion:** use the theme's easings (`ease-spring` for things that pop, `ease-out-expo` for
  things that glide) and `animate-*` tokens in `src/app/index.css`. Prefer CSS (transitions,
  `@starting-style`, keyframes) over JS, animate `transform`/`opacity`/`scale`/`translate`, give
  pressables an `active:` squish, and keep everything off under reduced motion (the base layer
  does this for CSS; WAAPI calls check `prefersReducedMotion()`). Anything that scales or pokes
  out (badges, rings) needs room inside `overflow` containers, or it gets clipped.
- **Mobile first:** design at 360–390 px wide first, then `sm:`/`lg:`. Use `dvh` and
  `env(safe-area-inset-*)`; no horizontal scrolling (an e2e test enforces this).
- Named exports only; files named after their main export; tests sit next to the code
  (`*.test.ts[x]`).

## Tooling quirks worth knowing

- `typescript` in `package.json` is an alias for `@typescript/typescript6`: typescript-eslint
  needs the TS 6 compiler API, which TS 7 does not ship. The real compiler is
  `@typescript/native` (TS 7) and provides `tsc`. Don't "fix" this alias.
- Type-aware lint rules run in **oxlint** (`--type-aware`, via oxlint-tsgolint). ESLint only
  runs the React Compiler/Hooks rules; `eslint-plugin-oxlint` switches off everything oxlint
  already covers. Configure rules in `.oxlintrc.json` first.
- `@vite-pwa/assets-generator` is pinned to 1.x because vite-plugin-pwa's peer range stops there.
- Images are optimized at build time by **vite-imagetools** via import queries
  (`photo.jpg?w=480;800&format=avif&as=srcset`, `…&inline` for data URLs); their module types
  live in `src/types/imagetools.d.ts`. Commit source photos at ≤ 1800 px wide, never the
  generated variants.
- Icons are generated at build time from `public/icon.svg` (`pwa-assets.config.ts`); don't
  commit PNG icons.
- The service worker only exists in production builds, so test offline behaviour with
  `pnpm build && pnpm preview` or `pnpm e2e`.

## Versioning and releases

- Versions are semver git tags (`v0.1.0` is the original 2022 app). `package.json` holds the
  current version, and the app shows it in the footer.
- The changelog is generated from Conventional Commit subjects by git-cliff (`cliff.toml`), so
  write subjects for players and maintainers: they become changelog lines. The in-app changelog
  is generated from git at build time (`scripts/changelogPlugin.ts`, `virtual:changelog`), so it
  always matches the build; commits after the latest tag show as "Unreleased". `CHANGELOG.md`
  is the committed copy, rewritten by `pnpm release` (or `pnpm changelog`); never edit it by
  hand.
- Release with `pnpm release` (defaults to a patch bump). It commits `chore(release): vX.Y.Z` and
  creates the tag. `git push --follow-tags` publishes it, and the Release workflow creates a
  GitHub Release from that version's changelog section.

## Definition of done

1. `pnpm check` passes (the pre-commit hook runs the fast parts on staged files).
2. For behaviour changes: unit tests in `src/**`, plus an e2e spec for user-visible flows.
3. For UI changes: verified in a real browser at **390×844 (mobile)** and **1440×900
   (desktop)** with no console errors; see [`docs/agentic-workflow.md`](docs/agentic-workflow.md).
4. `pnpm e2e` passes when you touch routing, persistence, the service worker or layout.
5. One logical change per commit, using Conventional Commits (`feat:`, `fix:`, `refactor:`,
   `test:`, `docs:`, `chore:`, `ci:`). The body explains _why_.

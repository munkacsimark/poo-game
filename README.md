# 💩 Poo Game

Tap the emoji. Keep tapping. Eventually it poops out a new one. Collect all 298, from
Common up to the one-in-2,000 **Galaxy Opal**.

**Play:** <https://munkacsimark.github.io/poo-game/>. It works on phones and can be installed
as an app that runs offline.

## Features

- Seven themed rarity tiers with published drop rates, a glassy dark UI and rarity glow effects
- Collection progress per rarity with filtering and "new" badges
- Bad-luck protection (Epic or better every 30 drops, Legendary or better every 150)
- Up to 5 player profiles per device, with export/import to move progress between devices
- Four themes (Aurora, Retro Web, Terminal, Luxe), each in light and dark or following the
  system; in-app FAQ and changelog; sound toggle, haptics on Android, reduced-motion support
- Installable PWA with offline play; progress is saved locally

## Development

Requires Node 24+ and pnpm 10 (`corepack enable`).

```sh
pnpm install
pnpm dev      # http://localhost:5173/poo-game/
pnpm check    # format, lint, typecheck, dead-code check, unit tests
pnpm e2e      # Playwright end-to-end tests
```

Built with React 19 (React Compiler), TypeScript 7, Vite 8, Tailwind CSS v4, Vitest,
Playwright, oxlint, ESLint, oxfmt and knip.

- [`AGENTS.md`](AGENTS.md): conventions and commands for contributors and AI agents
- [`docs/architecture.md`](docs/architecture.md): game loop, state, persistence, styling
- [`docs/agentic-workflow.md`](docs/agentic-workflow.md): working on this repo with AI agents

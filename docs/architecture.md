# Architecture

## Game loop

Each tap is a **push**. After a random number of pushes (1–60, rolled per drop) the emoji
**drops** a new one: the 💩 animation plays for 2 s, then the rolled emoji is added to the
collection and becomes the selected emoji. Pushes during the animation are ignored.

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> idle: push (pushes < pushesNeeded)
    idle --> dropping: push (pushes reaches pushesNeeded)
    dropping --> dropping: push (ignored)
    dropping --> idle: drop after 2 s (emoji added, counter reset, new pushesNeeded)
    idle --> idle: select (owned emoji only)
```

## Data flow

```
 tap ─▶ PooButton.onPush ─▶ useGame.push
                              ├─ play sound (unless muted)
                              ├─ dispatch({ type: "push" })            ─▶ gameReducer (pure)
                              └─ if this push completes the drop:
                                   roll emoji now, then after 2 s
                                   dispatch({ type: "drop", emoji, pushesNeeded }) + vibrate

 state ─▶ App ─▶ PooButton / DropToast / CollectionPanel (derived: sortCollection, rarityStats)
 state.{selected, clicks, collection} ─▶ useEffect ─▶ writeSave (localStorage)
```

- `gameReducer.ts` is pure and fully unit-tested. Randomness enters only through action
  payloads.
- `useGame.ts` owns every side effect: sound, the drop timer, persistence and haptics.
- Collection views are derived on each render with `sortCollection` / `rarityStats`. The React
  Compiler memoizes components, so there's no manual caching.

## Rarity and odds

`RARITIES` in `features/game/rarity.ts` is ordered rarest → most common. Each tier has a weight,
and a drop rolls a tier first, then a uniform emoji within it:

| Rarity      | Weight | Chance per drop | Emojis |
| ----------- | -----: | --------------: | -----: |
| Galaxy Opal |      1 |           0.43% |      1 |
| Legendary   |      4 |           1.72% |      6 |
| Epic        |      8 |           3.43% |     16 |
| Rare        |     21 |           9.01% |     45 |
| Uncommon    |     55 |          23.61% |     80 |
| Common      |    144 |          61.80% |    150 |

A drop never repeats the currently selected emoji, so every drop visibly changes the stage.

## Persistence

Progress lives in `localStorage` under one key and is validated on every load:

```jsonc
// "poo-game:save"
{
  "version": 1,
  "selected": "🦄", // must be a known emoji, otherwise the save is ignored
  "clicks": 1234, // non-negative integer
  "collection": { "🦄": 2 }, // unknown emojis / non-positive counts are dropped
}
```

- `"poo-game:muted"` stores the sound toggle (boolean).
- **Legacy migration:** the 2022 version stored `collected_emojis`, `last_emoji` and `clicks`
  as `{ value, createdDate }` entries via `local-data-storage`. `loadSave()` converts them once
  into the v1 format and deletes the old keys.
- To change the format, bump `SAVE_VERSION`, migrate the previous version inside `loadSave()`,
  and cover it in `save.test.ts`.

## Styling system

- `src/app/index.css` holds the Tailwind entry point and `@theme` tokens: fonts, the rarity
  palette (`--color-common` … `--color-galaxy-opal`) and animations (shine, drop, aurora, opal,
  pop-in, toast).
- Custom utilities there: `glass` (frosted panel), `rarity-*` (sets `--rarity`) and
  `opal-border` (animated iridescent border using a registered `@property`).
- Components pick up rarity colors via `RARITY_CLASS[rarity]` and then use
  `text-(--rarity)`, `bg-(--rarity)/12`, `shadow-[…var(--rarity)]`.
- **Stage photo** (`StageBackground`): the original meadow photo sits behind the clickable
  emoji. vite-imagetools turns the 1800 px source into AVIF and WebP srcsets (480–1600 w, about
  25–210 KB), a JPEG fallback and a 32 px WebP inlined as a data URL. The placeholder shows
  immediately, blurred and scaled (blur-up), and the full image fades in on `load`. When the
  emoji changes, the photo layer blurs out (blur 20 px → 0 via the Web Animations API). A rarity
  tint and a dark gradient on top keep the emoji readable.
- Reduced motion is handled globally in the base layer; the push squash (Web Animations API)
  checks `prefers-reduced-motion` itself.

## PWA

`vite-plugin-pwa` generates a Workbox service worker (`registerType: "autoUpdate"`) that
precaches HTML, JS, CSS, fonts, icons and sounds, so the game works fully offline after the
first visit. Images are cached at runtime (cache-first), so each device stores only the stage
photo size it actually loaded. `pwa-assets.config.ts` generates favicon, Apple touch, maskable and manifest icons
from `public/icon.svg` at build time.

## Testing strategy

| Layer      | Where                       | What                                                                               |
| ---------- | --------------------------- | ---------------------------------------------------------------------------------- |
| Unit       | `src/features/**/*.test.ts` | rolls (with fixed RNG), reducer, save/migration, sorting                           |
| Component  | `src/app/App.test.tsx`      | first run, deterministic drop (fake timers), select, filter, mute                  |
| End-to-end | `e2e/*.spec.ts`             | production build: drop + reload persistence, filter, popover, no overflow, offline |

To make a drop deterministic, stub `Math.random` to return `0`: one push is then enough, and
the drop is always 💩 (Galaxy Opal).

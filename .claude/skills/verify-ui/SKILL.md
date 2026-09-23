---
name: verify-ui
description: Verify a UI change of Poo Game in a real browser via chrome-devtools-mcp, on mobile and desktop viewports, checking console errors, layout and accessibility. Use after any change to components, styles or layout, and before committing UI work.
---

# Verify a UI change in the browser

1. **Start the dev server** if it isn't running: `pnpm dev --port 5173 --strictPort` in the
   background. The app lives at `http://localhost:5173/poo-game/` (note the base path).
2. **Open it** with `new_page` (or `navigate_page` if a tab exists). Every screen has a URL
   (`/poo-game/profiles`, `/poo-game/profiles/manage`, `/poo-game/faq`, …; see
   `src/app/router.tsx`), so open the one you changed directly, and check Back/Forward.
3. **Seed state when the change needs it**, via `evaluate_script`. Storage is sealed, so use
   the dev-server helper (schema: "Data format" in docs/architecture.md):

   ```js
   const now = new Date().toISOString();
   const progress = (selected, ids, taps = 0) => ({
     selected,
     taps,
     collection: Object.fromEntries(ids.map((id) => [id, { count: 1, firstFoundAt: now }])),
     pity: { sinceEpic: 29, sinceLegendary: 0 }, // the next drop is guaranteed Epic or better
   });
   window.pooGameDev.writeSave({
     format: "poo-game/save",
     version: 2,
     updatedAt: now,
     activeProfileId: "a",
     profiles: [
       {
         id: "a",
         name: "Mark",
         avatar: "fox",
         createdAt: now,
         progress: progress("unicorn", ["unicorn", "pile-of-poo"], 120),
       },
       {
         id: "b",
         name: "Anna",
         avatar: "panda",
         createdAt: now,
         progress: progress("french-fries", ["french-fries"]),
       },
     ],
   });
   location.reload();
   ```

   `window.pooGameDev.readSave()` shows what's stored. With two or more profiles the app opens
   on the picker. `localStorage.clear()` and a reload show the first-run experience; writing
   anything invalid shows the save error screen.

4. **Mobile first:** `emulate` with viewport `390x844x2,mobile,touch`, then `take_screenshot`.
   Also check `360x740x2,mobile,touch` when header or chip layout changed.
5. **Desktop:** `emulate` with viewport `1440x900x1` and take a screenshot.
6. **Interact** with `take_snapshot` (a11y tree with uids) plus `click`. To force a drop on
   the next push, add an init script that zero-fills `crypto.getRandomValues` (`crypto.getRandomValues = (a) => a.fill(0)`), or push repeatedly
   (up to 60 times) and wait about 2 s for the drop animation.
7. **Console:** `list_console_messages` with types `error` and `warn` must be empty.
8. **Accessibility** (for non-trivial UI changes): `pnpm build`, run
   `pnpm preview --port 4173` in the background, then `lighthouse_audit` (device `mobile`) on
   `http://localhost:4173/poo-game/`. Accessibility, Best Practices and SEO should stay at 100.
9. **Offline/PWA changes:** in the preview build, wait for `navigator.serviceWorker.ready`,
   `emulate` with `networkConditions: "Offline"`, reload, and confirm the app renders. Reset
   the network afterwards.

Report what you checked, with the screenshots' key observations, and fix issues before committing.

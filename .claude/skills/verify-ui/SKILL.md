---
name: verify-ui
description: Verify a UI change of Poo Game in a real browser via chrome-devtools-mcp, on mobile and desktop viewports, checking console errors, layout and accessibility. Use after any change to components, styles or layout, and before committing UI work.
---

# Verify a UI change in the browser

1. **Start the dev server** if it isn't running: `pnpm dev --port 5173 --strictPort` in the
   background. The app lives at `http://localhost:5173/poo-game/` (note the base path).
2. **Open it** with `new_page` (or `navigate_page` if a tab exists).
3. **Seed state when the change needs it**, via `evaluate_script`. The save format is:

   ```js
   localStorage.setItem(
     "poo-game:save",
     JSON.stringify({
       version: 1,
       selected: "🦄",
       clicks: 120,
       collection: { "🦄": 2, "💩": 1, "🍟": 5 },
     }),
   );
   location.reload();
   ```

   Call `localStorage.clear()` and reload to see the first-run experience.

4. **Mobile first:** `emulate` with viewport `390x844x2,mobile,touch`, then `take_screenshot`.
   Also check `360x740x2,mobile,touch` when header or chip layout changed.
5. **Desktop:** `emulate` with viewport `1440x900x1` and take a screenshot.
6. **Interact** with `take_snapshot` (a11y tree with uids) plus `click`. To force a drop on
   the next push, add an init script that sets `Math.random = () => 0`, or push repeatedly
   (up to 60 times) and wait about 2 s for the drop animation.
7. **Console:** `list_console_messages` with types `error` and `warn` must be empty.
8. **Accessibility** (for non-trivial UI changes): `pnpm build`, run
   `pnpm preview --port 4173` in the background, then `lighthouse_audit` (device `mobile`) on
   `http://localhost:4173/poo-game/`. Accessibility, Best Practices and SEO should stay at 100.
9. **Offline/PWA changes:** in the preview build, wait for `navigator.serviceWorker.ready`,
   `emulate` with `networkConditions: "Offline"`, reload, and confirm the app renders. Reset
   the network afterwards.

Report what you checked, with the screenshots' key observations, and fix issues before committing.

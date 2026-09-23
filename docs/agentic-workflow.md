# Agentic workflow

How to work on this repo with AI coding agents so their changes stay small, verified and
reviewable. It applies to any agent; the Claude Code setup is described at the end.

## The loop

1. **Understand.** Read `AGENTS.md`, then the relevant part of
   [`architecture.md`](architecture.md). For library questions, fetch current docs (Context7
   MCP or the official site); this stack is newer than most training data.
2. **Plan.** For anything bigger than a one-file fix, write a short numbered plan in which each
   step is one commit. Raise genuine product decisions (look and feel, scope, data migrations)
   with the human before building. Settle the rest with the conventions in `AGENTS.md`.
3. **Implement one step.** Keep the reducer pure, keep side effects in hooks, and put new
   styling tokens in `@theme`.
4. **Test.** Add or extend unit tests next to the code. Add an e2e spec for any new
   user-visible flow.
5. **Verify.**
   - `pnpm check`: format, lint, typecheck, knip and unit tests.
   - UI changes: check in a real browser at mobile and desktop sizes with no console errors
     (steps below, or `/verify-ui` in Claude Code).
   - Persistence, PWA or layout changes: `pnpm e2e`.
6. **Commit.** Use a Conventional Commit message and explain _why_ in the body. The lefthook
   pre-commit hook formats staged files and runs oxlint, ESLint and the typecheck. Never skip it
   with `--no-verify`; if the hook fails, fix the cause.
7. Repeat from step 3 until the plan is done, then open a PR. CI runs the same checks plus e2e
   and deploys `master` to GitHub Pages.

## Browser verification (chrome-devtools-mcp)

The project `.mcp.json` registers [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp),
so agents can drive a real Chrome:

| Goal                 | Tools                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| Open the app         | `new_page` → `http://localhost:5173/poo-game/`                        |
| Mobile / desktop     | `emulate` viewport `390x844x2,mobile,touch` / `1440x900x1`            |
| See it               | `take_screenshot` (visual), `take_snapshot` (a11y tree with uids)     |
| Interact             | `click`, `press_key`, `fill`                                          |
| Seed / inspect state | `evaluate_script` (localStorage, `Math.random` stubs)                 |
| Errors               | `list_console_messages` (types `error`, `warn`)                       |
| Quality gates        | `lighthouse_audit` on the preview build (a11y / best practices / SEO) |
| Offline              | `emulate` `networkConditions: "Offline"` on the preview build         |

The full step-by-step checklist is in `.claude/skills/verify-ui/SKILL.md` and is written to be
usable by any agent.

## Guardrails for agents

- Don't hand-edit `pnpm-lock.yaml`. Change dependencies with `pnpm add` / `pnpm remove`, and
  explain in the commit why a version is pinned below latest.
- Don't replace the `typescript` → `@typescript/typescript6` alias (see `AGENTS.md`).
- Don't commit generated output: `dist/`, `coverage/`, `playwright-report/`, generated icons.
- Don't lower Lighthouse accessibility, remove tests, or add lint suppressions to get a green
  run. Fix the underlying issue, or ask.
- Any change to the save format needs a migration and a test.

## Claude Code setup

- `CLAUDE.md` imports `AGENTS.md` and adds Claude-specific notes.
- `.mcp.json` provides chrome-devtools-mcp (approve it on first use).
- `.claude/skills/verify-ui` provides the `/verify-ui` skill for browser verification.
- A good kickoff prompt for a feature:

  > Read AGENTS.md. Plan <feature> as a list of commits and ask me about product decisions.
  > Then implement it commit by commit, running `pnpm check` and `/verify-ui` before each
  > commit.

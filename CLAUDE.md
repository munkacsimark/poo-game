@AGENTS.md

## Claude Code specifics

- The project `.mcp.json` provides **chrome-devtools-mcp**. Use it to check every UI change
  in a real browser; the `/verify-ui` skill (`.claude/skills/verify-ui`) has the steps.
- Look up library docs (Vite, Tailwind, Vitest, Playwright, oxc, …) with the Context7 MCP
  server when it's available instead of relying on memory; this stack moves fast.
- Commit after each logical step instead of batching unrelated changes.

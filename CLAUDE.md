# CLAUDE.md

@AGENTS.md
@GUARDRAILS.md

Load everything else by task, using the context map in AGENTS.md §0: a feature's work reads only that feature's
`apps/web/features/<feature>/CONTEXT.md` and the `DESIGN.md` sections it names. Update `STATUS.md` after every
meaningful step so another AI can resume if you are cut off.

## Orchestrator mode (owner, 2026-11-12)

The main session is the **lead planner**. It decides who does each piece of work, and it checks every change.
Each subagent starts cold and re-reads the docs, so spawn one only when that pays for itself.

**1. Plan.** Read the task's `CONTEXT.md` (AGENTS.md §0). Write down the requirements and the files to touch.

**2. Do it directly or delegate.**

The main session does the work itself when any of these is true:
- the change is about 1–3 files and the requirement is clear;
- it needs judgment, context from the chat, or a design or copy decision;
- it needs heavy reasoning (architecture, security, admin and data logic, hard bugs).

It spawns a subagent, passing `model` every time, when:

| Work | Agent / model |
|---|---|
| 2 or more independent pieces with **no shared files** | `sonnet`, in parallel. Use `isolation: "worktree"` if files could overlap |
| A broad search across the codebase | `Explore` |
| A long mechanical batch (many files, same pattern) | `haiku` if trivial, otherwise `sonnet` |
| A `STATUS.md` update | `docs-keeper` (haiku) |

Never spawn `opus` subagents: the main session already runs on Opus and holds the context. Give each subagent its
`CONTEXT.md` path, the exact requirements (including Figma copy and rates), the files it may touch, and the rules in
AGENTS.md §3 and GUARDRAILS.md.

**3. Verify every change, whoever wrote it.**
- Check the diff against every requirement from step 1 and the Figma-verified copy and rates.
  Anything missing goes back to whoever wrote it.
- Check code quality against AGENTS.md §3 rule 7. Run `/code-review` on changes that aren't trivial.
- Run `npm run typecheck`, `npm run lint` and `npm run build`. For UI work, also take a desktop and a 390px screenshot (port 4310).

Report to the owner who did what and on which model, what passed, and what is still open.

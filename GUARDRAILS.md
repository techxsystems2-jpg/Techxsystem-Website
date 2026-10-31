# GUARDRAILS.md: things no AI may do in this project

These rules bind every AI agent working here. In Claude Code they are **enforced by a hook**: every command, file edit and MCP tool call is checked before it runs, and a breach is blocked.
Other AI tools must follow them as written (see "Other AI tools" below).

**Only the owner changes these rules.** AIs that try to edit the guard files are stopped and must ask first.

## The guardrails

| ID | Rule | What is blocked | Enforced |
|---|---|---|---|
| **G1** | **No git operations except reading.** | Anything that changes git or the remote: `commit`, `push`, `pull`, `fetch`, `merge`, `rebase`, `reset`, `revert`, `checkout`, `switch`, `add`, `rm`, `mv`, `clean`, `stash` (except list/show), `tag` (except list), creating or deleting branches, `config` writes, `clone`, `init`, submodules. On GitHub (`gh`): creating, merging, closing or deleting anything, and API calls that write. **Allowed:** `git status`, `log`, `diff`, `show`, `blame`, `ls-files`, `branch` (list only), `remote -v`; `gh pr view` / `list` / `status`. | Hook (deny) + Claude Code deny list |
| **G2** | **No deleting anything in a database, and no direct schema pushes.** | SQL `DROP`, `TRUNCATE`, `DELETE FROM`, `ALTER TABLE … DROP`; `dropdb`; Redis `FLUSHALL` / `FLUSHDB`; Mongo drops and `deleteMany`. Also direct schema changes and resets: `drizzle-kit push` / `drop` / `migrate`, `prisma migrate reset` / `deploy` / `dev`, `prisma db push`, `supabase db reset` / `push`, `neonctl … delete`, `psql -c` or `psql < file`, `npm run db:push` / `reset` / `drop` / `migrate` / `seed`. **Allowed:** writing migration files (e.g. `drizzle-kit generate`) for the owner to review and run. | Hook (deny) |
| **G3** | **No production deploys and no deleting hosting resources.** | `vercel --prod`, `vercel promote`, `vercel rollback`, and `vercel rm` of projects, env vars, domains, DNS, aliases, certificates or Blob files. **Allowed:** preview deploys (`vercel deploy`) and reading logs. The owner deploys to production. | Hook (deny) |
| **G4** | **No deleting the repo's history or data files.** | `rm` of `.git`, migrations folders, `.sqlite` / `.db` files; `find … -delete`. | Hook (deny) |
| **G5** | **No destructive MCP tools.** | Any connected tool (database, GitHub, Vercel, Notion, Drive and so on) whose action deletes, drops, truncates, destroys, purges, resets, wipes, archives or unpublishes, or that pushes, commits, creates branches, opens pull requests or merges. SQL sent through an MCP tool is checked against G2. | Hook (deny) |
| **G6** | **The guardrails protect themselves.** | Editing `.claude/settings.json`, anything in `.claude/hooks/` or this file needs the owner's approval. From the shell (redirects, `sed -i`, `mv`, `rm`, `cp`, `chmod`) it is blocked outright. | Hook (ask / deny) |
| **G7** | **Content rules** (not yet hook-enforced). | Everything in `AGENTS.md` §1 and §3: only Figma-verified copy and rates, starting price always "from $0.50", no invented proof, placeholders stay visible. | Written rule. A content-check hook is planned |
| **G8** | **Quality targets** (checked in CI once the app exists). | `AGENTS.md` §3 rules 5–6: Lighthouse mobile 95+, CLS 0, accessibility 100. | Written rule, then CI |

**When a rule blocks you:** stop and tell the owner what you wanted to do and why. Write it in `STATUS.md` under Open questions. Never look for another way to do the same thing.

## How it works

- `.claude/settings.json` runs `.claude/hooks/guard.py` before every `Bash`, `Edit`, `Write`, `MultiEdit`, `NotebookEdit` and `mcp__*` call. It also has a backup deny list for the most dangerous git and deploy commands.
- `guard.py` reads `.claude/hooks/guardrails.json` and answers **deny**, **ask** or **allow**.
  - It checks chained commands (`&&`, `;`, `|`), subshells, `bash -c '…'`, `eval`, `sudo` and environment-variable prefixes.
  - It **fails closed:** if the rules file is missing or broken, everything is blocked.
- Every block is logged to `.claude/hooks/guardrails.log` (local only; add it to `.gitignore`).
- Self-test: `python3 .claude/hooks/guard.py --test` (52 checks).
- Check one command without running it: `python3 .claude/hooks/guard.py --check-command "git push"`.

## Adding a new guardrail (owner)

1. Add an entry to `rules` in `.claude/hooks/guardrails.json`:
   ```json
   {
     "id": "G9-short-name",
     "description": "One sentence the AI will see when it is blocked.",
     "applies_to": ["bash"],
     "patterns": ["regex that matches the forbidden thing"],
     "decision": "deny"
   }
   ```
   - `applies_to` can be `bash` (shell commands), `file_edit` (file paths), `mcp_name` (MCP tool names) or `mcp` (MCP tool inputs).
   - `decision` is `deny` (block) or `ask` (the AI must get your approval).
2. Add a row to the table above.
3. Add a test case to `TESTS` in `guard.py` and run `python3 .claude/hooks/guard.py --test`.

Claude Code will ask you to approve these edits. That's G6 working.

## Other AI tools

The hook is wired into **Claude Code** (it runs when Claude Code is opened in this folder).
- **Other tools** (Cursor, Gemini CLI, Codex, Copilot) read these rules through their pointer files, but only Claude Code enforces them automatically today.
- **To add enforcement elsewhere,** point that tool's own hook or approval setting at `guard.py`; the `--check-command` mode is tool-agnostic. Until then, run those tools in their "ask before running commands" mode.
- **The strongest protection sits outside the AI:**
  - protect the `main` branch on GitHub (no direct pushes, no force-push, no deletion);
  - give the app's database user no `DROP` or `TRUNCATE` rights;
  - keep production database credentials out of local `.env` files.

  The owner does these setup steps; AIs may not, because they would be git or database changes.

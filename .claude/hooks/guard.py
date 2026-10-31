#!/usr/bin/env python3
"""TechX website guardrail hook.

Runs before every AI tool call (Claude Code PreToolUse hook). It reads the call as JSON on stdin,
checks it against .claude/hooks/guardrails.json and answers deny / ask / allow.
A tool-agnostic CLI is included so other AI tools and tests can use the same rules:

    python3 .claude/hooks/guard.py --check-command "git push"
    python3 .claude/hooks/guard.py --test

If this script crashes or the rules file is missing, it blocks (fails closed), so a broken guard never
silently lets a destructive action through.
"""
import json
import os
import re
import shlex
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RULES_PATH = os.path.join(HERE, "guardrails.json")
LOG_PATH = os.path.join(HERE, "guardrails.log")

GIT_GLOBAL_OPTS_WITH_VALUE = {"-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path", "--config-env"}
SEGMENT_SPLIT = re.compile(r"\|\||&&|;|\||\n|`|\$\(|\)")


def load_rules():
    with open(RULES_PATH, encoding="utf-8") as f:
        return json.load(f)


def segments(command):
    """Split a shell line into simple commands, including ones inside $( ) and backticks."""
    return [s.strip() for s in SEGMENT_SPLIT.split(command) if s.strip()]


def words(segment):
    try:
        return shlex.split(segment, posix=True)
    except ValueError:
        return segment.split()


def unwrap(tokens):
    """Strip prefixes that just run another command: env vars, sudo, env, nice, time, xargs, command."""
    wrappers = {"sudo", "env", "nice", "time", "command", "exec", "nohup", "xargs", "builtin"}
    while tokens:
        t = tokens[0]
        if re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", t) or t in wrappers or (t.startswith("-") and len(tokens) > 1 and tokens[0] != "git"):
            tokens = tokens[1:]
            continue
        break
    return tokens


def nested_shell_commands(tokens):
    """bash -c '...', sh -c '...', eval '...' carry a whole command line as an argument."""
    out = []
    if tokens and os.path.basename(tokens[0]) in {"bash", "sh", "zsh", "dash", "fish"}:
        for i, t in enumerate(tokens[:-1]):
            if t in {"-c", "-lc", "-ic"}:
                out.append(tokens[i + 1])
    if tokens and tokens[0] == "eval":
        out.append(" ".join(tokens[1:]))
    return out


def check_git(tokens, cfg):
    """Return a reason string if this git call is not read-only, else None."""
    args = tokens[1:]
    i = 0
    while i < len(args) and args[i].startswith("-"):
        opt = args[i].split("=", 1)[0]
        i += 2 if (opt in GIT_GLOBAL_OPTS_WITH_VALUE and "=" not in args[i]) else 1
    if i >= len(args):
        return None  # bare "git" or "git --version"
    sub, rest = args[i], args[i + 1:]
    if sub in cfg["readonly_subcommands"]:
        return None
    listing = cfg["listing_only_subcommands"].get(sub)
    if listing is not None:
        first = rest[0] if rest else ""
        if first in listing and (sub not in {"branch", "tag"} or all(r.startswith("-") or r in listing for r in rest)):
            return None
        return f"`git {sub}` that changes something"
    return f"`git {sub}`"


def check_gh(tokens, cfg):
    joined = " ".join(tokens[1:3])
    one = tokens[1] if len(tokens) > 1 else ""
    if any(joined.startswith(ok) or one == ok for ok in cfg["gh_readonly"]):
        if not any(t in {"-X", "--method"} for t in tokens):
            return None
    return f"`gh {joined}`"


def evaluate_command(command, rules):
    """Return (decision, rule_id, reason) for a shell command line."""
    queue = [command]
    seen = 0
    while queue and seen < 50:
        line = queue.pop()
        seen += 1
        for seg in segments(line):
            toks = unwrap(words(seg))
            if not toks:
                continue
            queue.extend(nested_shell_commands(toks))
            prog = os.path.basename(toks[0])
            if prog == "git":
                why = check_git(toks, rules["git"])
                if why:
                    return "deny", "G1-no-git-writes", f"{why} is blocked. AIs may only read git (status, log, diff, show). The owner does all commits, pushes, merges, resets and deletes."
            if prog == "gh":
                why = check_gh(toks, rules["git"])
                if why:
                    return "deny", "G1-no-git-writes", f"{why} is blocked. AIs may only read from GitHub. The owner creates, merges, closes and deletes."
    # Pattern rules run on the whole line too, so quoting or odd spacing can't hide a match.
    for rule in rules["rules"]:
        if "bash" not in rule["applies_to"]:
            continue
        for pat in rule["patterns"]:
            if re.search(pat, command, re.IGNORECASE):
                return rule["decision"], rule["id"], rule["description"]
    # Last line of defence: git verbs that change state anywhere in the line (e.g. built from variables).
    if re.search(r"\bgit\b[^\n;|&]*\b(push|commit|merge|rebase|reset|revert|cherry-pick|am|apply|clean|rm|mv|add|restore|checkout|switch|init|clone|pull|fetch|gc|prune|filter-branch|filter-repo|update-ref|replace|notes|submodule|lfs|tag\s+-d|branch\s+-[dDmMcC])\b", command):
        return "deny", "G1-no-git-writes", "This line looks like it changes git state. AIs may only read git (status, log, diff, show)."
    return "allow", None, None


def evaluate(payload, rules):
    tool = payload.get("tool_name", "")
    tin = payload.get("tool_input", {}) or {}
    if tool == "Bash":
        return evaluate_command(tin.get("command", ""), rules)
    if tool in {"Edit", "Write", "MultiEdit", "NotebookEdit"}:
        path = tin.get("file_path") or tin.get("notebook_path") or ""
        for rule in rules["rules"]:
            if "file_edit" in rule["applies_to"] and any(re.search(p, path) for p in rule["patterns"]):
                return rule["decision"], rule["id"], rule["description"]
        return "allow", None, None
    if tool.startswith("mcp__"):
        short = tool.split("__")[-1].lower()
        for rule in rules["rules"]:
            if "mcp_name" in rule["applies_to"] and any(re.search(p, short, re.IGNORECASE) for p in rule["patterns"]):
                return rule["decision"], rule["id"], rule["description"]
        text = json.dumps(tin)
        for rule in rules["rules"]:
            if "mcp" in rule["applies_to"] and any(re.search(p, text, re.IGNORECASE) for p in rule["patterns"]):
                return rule["decision"], rule["id"], rule["description"]
    return "allow", None, None


def log(decision, rule_id, tool, detail):
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps({"decision": decision, "rule": rule_id, "tool": tool, "detail": detail[:300]}) + "\n")
    except OSError:
        pass


def respond(decision, reason):
    out = {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": decision,
                                  "permissionDecisionReason": f"TechX website guardrail: {reason} See GUARDRAILS.md."}}
    print(json.dumps(out))


TESTS = [
    ("git status", "allow"), ("git log --oneline -10", "allow"), ("git diff HEAD~1", "allow"), ("git -C /x show abc", "allow"),
    ("git branch", "allow"), ("git branch --show-current", "allow"), ("git remote -v", "allow"), ("git stash list", "allow"),
    ("git push origin main", "deny"), ("git commit -m x", "deny"), ("git add .", "deny"), ("git reset --hard", "deny"),
    ("git branch -D feature", "deny"), ("git tag -d v1", "deny"), ("git checkout main", "deny"), ("git -C repo push", "deny"),
    ("cd x && git push", "deny"), ("bash -c 'git push --force'", "deny"), ("echo hi; git clean -fd", "deny"),
    ("FOO=1 git commit -am x", "deny"), ("sudo git push", "deny"), ("gh pr create --fill", "deny"), ("gh pr view 12", "allow"),
    ("gh api -X DELETE repos/a/b", "deny"), ("gh repo delete a/b", "deny"),
    ("psql $DATABASE_URL -c 'DROP TABLE posts'", "deny"), ("echo 'DELETE FROM users' | psql", "deny"), ("npx drizzle-kit push", "deny"),
    ("npx prisma migrate reset", "deny"), ("npm run db:push", "deny"), ("redis-cli FLUSHALL", "deny"),
    ("vercel --prod", "deny"), ("vercel deploy", "allow"), ("vercel env rm DATABASE_URL", "deny"), ("vercel rm my-app", "deny"),
    ("rm -rf .git", "deny"), ("rm -rf drizzle/migrations", "deny"), ("npm run build", "allow"), ("npx next dev", "allow"),
    ("npx drizzle-kit generate", "allow"), ("ls -la", "allow"), ("python3 gen.py", "allow"),
]


def self_test(rules):
    bad = 0
    for cmd, want in TESTS:
        got = evaluate_command(cmd, rules)[0]
        ok = got == want
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {want:5} {got:5} {cmd}")
    file_cases = [(".claude/settings.json", "ask"), (".claude/hooks/guard.py", "ask"), ("GUARDRAILS.md", "ask"), ("app/page.tsx", "allow")]
    for path, want in file_cases:
        got = evaluate({"tool_name": "Write", "tool_input": {"file_path": "/p/" + path}}, rules)[0]
        bad += got != want
        print(f"{'ok  ' if got == want else 'FAIL'} {want:5} {got:5} Write {path}")
    mcp_cases = [("mcp__neon__delete_project", "deny"), ("mcp__github__push_files", "deny"), ("mcp__github__create_pull_request", "deny"),
                 ("mcp__db__run_sql", "allow"), ("mcp__figma__get_screenshot", "allow")]
    for name, want in mcp_cases:
        got = evaluate({"tool_name": name, "tool_input": {"sql": "select 1"}}, rules)[0]
        bad += got != want
        print(f"{'ok  ' if got == want else 'FAIL'} {want:5} {got:5} {name}")
    got = evaluate({"tool_name": "mcp__db__run_sql", "tool_input": {"sql": "DROP TABLE posts"}}, rules)[0]
    bad += got != "deny"
    print(f"{'ok  ' if got == 'deny' else 'FAIL'} deny  {got:5} mcp__db__run_sql DROP TABLE")
    print(f"\n{len(TESTS) + len(file_cases) + len(mcp_cases) + 1 - bad} passed, {bad} failed")
    return bad


def main():
    try:
        rules = load_rules()
    except Exception as e:  # fail closed
        respond("deny", f"guardrails.json could not be read ({e}). Every tool call is blocked until it is fixed.")
        return 0
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test":
            return 1 if self_test(rules) else 0
        if sys.argv[1] == "--check-command":
            d, rid, why = evaluate_command(" ".join(sys.argv[2:]), rules)
            print(f"{d}: {rid or '-'} {why or ''}")
            return 2 if d == "deny" else 0
    try:
        payload = json.load(sys.stdin)
        decision, rule_id, reason = evaluate(payload, rules)
    except Exception as e:  # fail closed
        respond("deny", f"the guard could not check this action ({e}), so it is blocked.")
        return 0
    if decision in {"deny", "ask"}:
        log(decision, rule_id, payload.get("tool_name", ""), json.dumps(payload.get("tool_input", {})))
        respond(decision, f"[{rule_id}] {reason}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

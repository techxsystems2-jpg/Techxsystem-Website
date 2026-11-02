# AGENTS.md: TechX Systems website

**Every AI working in this repo reads this file first** (Claude, Codex, Gemini, Cursor, Copilot).
It holds the rules and a context map. Load the rest **only for the task in front of you**.

## 0. Context map: read only what the task needs

**Always:** this file, `GUARDRAILS.md`, the top of `STATUS.md` (Next steps, Open questions, newest Log entries).

**Then the row for your task.** Each feature folder has a `CONTEXT.md` holding everything for that feature: the Figma
node, the verified copy and rates, the files, and the open questions. Work on a feature reads **its** `CONTEXT.md`, not
the rest of the codebase.

| Task | Read | Skills (Claude Code) |
|---|---|---|
| A page or section | `apps/web/features/<feature>/CONTEXT.md` + `DESIGN.md` §1–6 | `frontend-design:frontend-design`, `make-interfaces-feel-better`, `mobile-native` |
| Nav, footer, final CTA | `apps/web/features/site-shell/CONTEXT.md` | same |
| Illustrations / motion | `apps/web/features/illustrations/CONTEXT.md` + `DESIGN.md` §6 | `animate`, `animation-performance` |
| Shared components (`@techx/ui`) | `DESIGN.md` §5 + `packages/ui/src/` | `make-interfaces-feel-better` |
| Tokens / theme | `DESIGN.md` + `packages/brand/theme.css` | — |
| Copy | the feature's `CONTEXT.md` + `DESIGN.md` §1 (voice) + `docs/old-site-content.md` (facts) | `marketing-skills:copywriting`, `marketing-skills:copy-editing` |
| SEO | `docs/sitemap.md` + `app/sitemap.ts`, `app/robots.ts` | `claude-seo:seo-page`, `claude-seo:seo-schema` |
| Next.js APIs | `apps/web/AGENTS.md`; `node_modules/next/dist/docs/` for the API you touch | `andrej-karpathy-skills:karpathy-guidelines` |
| Background only (when a decision needs it) | `docs/company-brief.md`, `docs/competitors.md`, `docs/decisions-log.md`, `docs/information-map.md` | — |

Adding a feature: create `apps/web/features/<name>/` with a `CONTEXT.md` in the same shape, then add it to `STATUS.md`.

## 1. Sources of truth (owner, 2026-10-30)

| What | Source |
|---|---|
| **UI and copy** (layout, sections, wording, rates) | **Figma** `WGW3zGaOx1NkmCCPomJTbV`, page "03 — Direction B". Transcribed into each feature's `CONTEXT.md` with a verified date |
| **Design system** (tokens, type, colour, spacing, radius, motion, component rules) | `DESIGN.md` → `docs/design-system/` |
| **Starting price** | **From $0.50 an image.** Always phrased as a starting price ("from"), never a fixed one |
| Other rates | Figma (see `features/home/CONTEXT.md` §7 and `lib/site.ts`) |
| **Content facts** (services, what each edit includes, process, testimonials, contacts) | **TechX's current site**, techxsystems.com (owner, 2026-11-02), captured in `docs/old-site-content.md`. Rephrase, never contradict or invent |

**This repo is self-contained.** `/Users/gauravrana/projects/TechX System` is a separate project (the October 2026 proposal archive and its HTML prototype). Don't read from it or edit it for website work, and keep all of this website's context in this repo (owner, 2026-11-02).

Don't take UI from the markdown docs or the old Direction B HTML. When Figma and a doc disagree on UI or copy, Figma
wins. Record the disagreement in `docs/OPEN_ITEMS.md`.

**Figma reads are rationed** (Starter plan, View seat). One `get_screenshot` per page at full height, cropped locally, is
enough to transcribe a page. Layer names in this file are stale; don't read copy from `get_metadata`.

## 2. Stack

| Layer | Choice |
|---|---|
| Repo | Turborepo, npm workspaces: `apps/web`, `packages/brand` (Tailwind theme), `packages/ui` (shared components), `packages/typescript-config` |
| Framework | Next.js 16.4 (App Router, Cache Components, Turbopack), TypeScript strict |
| Styling | Tailwind CSS v4 with `@techx/brand/theme.css`. Classes read like tokens: `bg-page`, `text-ink-2`, `text-h2`, `shadow-raised`, `rounded-card` |
| Fonts | Geist + Geist Mono via `next/font/google` |
| Motion | `motion/react` for interaction, `@number-flow/react` for changing numbers, CSS for hovers and simple loops. Nothing else |
| Hosting | Vercel (owner deploys production) |

## 3. Rules

1. **Information is non-negotiable.** How we do it, our process, our prices, how to start and how to contact stay one
   click away from every page at every width (`docs/information-map.md`).
2. **Real proof only.** No invented testimonials, logos, numbers or claims. Placeholders stay visibly marked.
3. **One action colour.** Blue is for buttons and links only, one primary button per view. Maroon never on buttons.
4. **Light only.** No dark mode.
5. **Performance first.** Server components by default; `"use client"` only for the interactive leaf. Hero never waits
   for JavaScript. Images via `next/image`, AVIF/WebP, lazy below the fold. Animate transform and opacity only.
6. **Accessibility.** One H1 per page, no skipped levels, 44px targets, visible focus, reduced motion shows end states,
   body text at least 16px, `text-ink-3` never for body text.
7. **Coding:** least code that solves it; surgical changes; remove what your change leaves unused; match the style
   around you; check each step (typecheck, lint, build, a desktop + 390px screenshot).
8. **Git:** read-only for AIs (`GUARDRAILS.md` G1). Give the command when the owner asks.
9. **All website copy goes through `marketing-skills:copywriting`** (owner, 2026-10-30): new sections, rewrites, labels
   and pointers. Follow its principles (clarity, the reader's words, specific over vague, no invented claims) and the
   voice in `DESIGN.md` §1.
10. **Port 3000 belongs to the owner's `npm run dev`.** Agents checking the site run their own preview on port 4310
   (`npx next start --port 4310` in `apps/web`), stop only that process by its own PID, and never kill whatever is
   listening on 3000. Killing it stops the owner's dev server with `npm error code 143` (SIGTERM).
11. **Keep `STATUS.md` current** after each meaningful step so another agent can resume.

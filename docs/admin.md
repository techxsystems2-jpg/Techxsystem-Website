# Admin panel: editing the website

Built 2026-11-03 (owner: "the whole website can be managed from there"; storage: Upstash + Vercel Blob; scope: everything,
in phases). Open **`/admin`** and sign in with `ADMIN_PASSWORD`. Not linked from the site, `noindex`, disallowed in robots.txt.

## What can be edited (phase 1)

| Section | Shows on |
|---|---|
| Site facts: starting price, WhatsApp, email, phone, studio, hours, trust badge figures, announcement bar | every page (header, CTAs, contact, structured data, llms.txt, share image) |
| Pricing levels: **add, remove, reorder (up to four)**; name, starting price, who it's for, list, featured level; bulk-editing row | Home, Pricing (+ calculator), Photo editing, Drone |
| Services: **add, remove, reorder**; name, short name, page address, one line, starting price, turnaround, tag, photo, page header, what's included, questions, levels on/off, which Work categories show, search title/description. The six original services keep their animated cards; new ones show their photo | Home, Services, Pricing table, header menu, footer, sitemap, `/services/<address>` |
| Testimonials | Home, About, Free trial |
| Questions (Home/Services, Pricing, Contact, Free trial) | those pages |
| Timeline, How we work cards | About |
| Team (name, role, portrait): the team section appears on About once every person has a portrait | About |
| Work gallery: photos in order, category, optional label; add several photos at once | Work, service pages' "Recent work" |
| **Blog**: write, edit, delete posts; title, page address, published/draft, date, author, cover photo, summary, tags, body (light formatting), search title/description | `/blog`, `/blog/<address>`, sitemap, llms.txt |
| **Search & sharing**: per page search title, description, share image (link previews), hide from search engines | every page's `<title>`, meta description, Open Graph / Twitter tags, sitemap |
| Free-trial uploads (Dropbox / Google Drive destination) | the free-trial form |

## Blog API

| Method | Address | Who | What |
|---|---|---|---|
| GET | `/api/blog` | anyone | `{ posts }`: published posts, newest first, no body |
| GET | `/api/blog/<slug>` | anyone | `{ post }`: one published post with its body |
| POST | `/api/blog` | admin session | create; JSON `{ title, body, excerpt?, cover?, date?, author?, tags?, published?, slug?, seo? }` |
| PUT | `/api/blog/<slug>` | admin session | update; send only the fields to change |
| DELETE | `/api/blog/<slug>` | admin session | remove |

Writes need the admin sign-in cookie (sign in at /admin first) and `Content-Type: application/json`. They go through the
same rules as the panel (field limits, address and date clean-up). Code: `app/api/blog/*`, `lib/server/blog-api.ts`.

**Phase 2 (not built yet):** every page's headings and text blocks. Layout and animations stay in code.

**Post formatting:** blank line = new paragraph · `## Heading` · `### Smaller heading` · `- list item` · `> quote` · `**bold**` · `*italic*` · `[link text](https://…)` · `![photo description](photo address)` on its own line (photos uploaded in the admin).

## How it works

- Defaults are the site as shipped (`lib/content/types.ts`). A saved value overrides its default; **Reset to original** removes it.
- Pages stay prerendered. Reads are cached (`'use cache'`, tag `content:<key>`, `lib/content/index.ts`); a save calls
  `updateTag`, so the next visit shows the change. No redeploy.
- Every save is re-checked on the server and shaped to the section's field description (`lib/content/fields.ts`):
  unknown fields dropped, text trimmed and length-limited, numbers clamped, photos only from our own files or our Blob store.
- Photos are shrunk in the browser (WebP, max 2400 px) and checked by their bytes on the server (`lib/server/media.ts`).

## Setup (owner)

1. `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `APP_SECRET`: sign in to /admin with that email and password (owner,
   2026-11-03). Tries are rate-limited (10 per 15 minutes per address and per email, through Redis when set).
2. **PostgreSQL** (owner, 2026-11-03): paste the database's connection link as `DATABASE_URL` in `apps/web/.env.local`
   (and in Vercel → Settings → Environment Variables). Neon, Supabase, Vercel Postgres or Railway all work; a pooled
   link (Supabase port 6543, Neon `-pooler` host) is fine.
3. Run in `apps/web`: `npm run db:setup` (again after any new file in `db/migrations/`). It creates the table (`db/migrations/0001_site_content.sql`) and
   copies anything already saved on this computer (`.data/`) into the database, without overwriting what's there.
   Safe to run again. The site never changes the database schema by itself.
4. **Vercel Blob** (Vercel → Storage → Blob → connect to the project): sets `BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN`. Photos live in
   Blob, not in the database. Without it photos can't be uploaded on Vercel.
5. Redeploy once. The /admin overview shows "Saves: PostgreSQL" when the database is in use, and warns on Vercel if
   saves or photos have nowhere to go.

**What's in the database** (owner, 2026-11-03: every record lives here; photos stay links to Blob / Drive):
- `services`: one row per service (slug, position, name, short_name, line, starting_at, turnaround, tag, image,
  scene, show_levels, work[], hero, fixes, faqs, note, seo_title, seo_description, updated_at). Removing a service in
  the admin removes its row. (`db/migrations/0002_services_and_posts.sql`)
- `blog_posts`: one row per post (slug, title, excerpt, cover, published_on, author, tags[], body, published,
  seo_title, seo_description, created_at, updated_at). Deleting a post deletes its row.
- `site_content`: one row per remaining section (`techx:content:facts`, `…:pricing`, `…:testimonials`, `…:faqs`,
  `…:timeline`, `…:values`, `…:team`, `…:work`, `…:seo`) and the free-trial upload settings (`techx:upload-settings`).
  A JSON `null` value means the section was reset to the built-in default.
- **Admin → Overview → "Save everything to the database"** writes every section that has nothing saved yet from the
  built-in content (all six services as rows, prices, questions…). It never overwrites saved content. The button
  only shows while something is still unsaved.

**Redis** (Upstash, `UPSTASH_REDIS_REST_URL` / `_TOKEN`): when PostgreSQL is set, Redis holds no content. It runs the
rate limits that hold across every server: admin sign-in (10 tries / 15 min, 40 / day per address), contact messages
and free-trial requests (`lib/server/rate-limit.ts`; keys are hashed, never raw IPs or emails). Without Redis the limits
fall back to each server's memory. If the
database is unreachable, the site keeps showing the last cached pages and built-in defaults; saves in the admin show
a readable error ("Run npm run db:setup once", "check DATABASE_URL") instead of failing silently.

**Without a database:** Upstash Redis (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) is still supported and
used only when `DATABASE_URL` is empty. With neither, saves go to `apps/web/.data/` and photos to
`apps/web/public/uploads/` (both git-ignored, local development only). Use `npm run dev` for photo uploads locally (a
production `next start` doesn't serve files added after the build).

## Files

`app/admin/` (layout = sign-in + sidebar, overview, `[section]` editor, `uploads`, `content-actions.ts`) ·
`features/admin/` (Editor, ImageField, AdminNav) · `lib/content/` (types + defaults, fields + validation, cached reads) ·
`lib/server/db.ts` (PostgreSQL pool), `lib/server/kv.ts` (store: PostgreSQL → Upstash → files), `lib/server/media.ts` ·
`db/migrations/`, `scripts/db-setup.mjs` · `features/content/ContentProvider.tsx` (facts + services for client components) ·
`lib/content/seo.ts` (page metadata + admin overrides) · `lib/content/blog.ts`, `app/blog/*`, `features/blog/render.tsx` (safe post formatting) ·
`features/service-art/ServiceVisual.tsx` (film for the six original services, photo for new ones).

Pages for services and posts created after a deploy render on their first visit; they look items up with `getItem()`
(own cache entry per address) because a list read on those pages would come from the build-time snapshot, which a save
doesn't refresh.

## Saving and caching (2026-11-03)

- **Autosave:** every edit saves itself 1.5 s after the last change (⌘S saves at once). The bar at the foot shows
  "Unsaved changes" → "Saving…" → "Saved at …", or the error with a Retry button. One save at a time; edits made during a
  save are saved right after it. Moving to another admin screen lets the save finish; closing the tab mid-edit warns.
- **Only what changed is written:** a save that changes nothing writes nothing; for services and posts only the rows
  that changed are written, so `updated_at` shows what was really edited.
- **Cache:** every page is prerendered and cached until something it shows changes (`'use cache'`, `cacheLife('max')`).
  A save refreshes only what it touched: the section's tag (`content:<section>`: lists, menus, every page showing it)
  and, for a service or post, that item's own page (`content:services:<slug>`, `content:blog:<slug>`); the other
  service and post pages stay cached. Photos cache 30 days, optimised images 31 days, pages 30 days at the edge with
  background refresh.
- **Loading:** opening the admin or a section shows a shimmering placeholder of that screen at once
  (`features/admin/Skeletons.tsx`, `app/admin/loading.tsx`, `app/admin/[section]/loading.tsx`).

## Before going live (security audit, 2026-11-03)

- In Vercel → Settings → Environment Variables (Production): `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` (email alerts, see `.env.example`), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (long and unique: 16+
  characters, not used anywhere else), `APP_SECRET` (32+ random characters, different from the one on your computer),
  `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN`, and the Upstash pair for rate limits. Without Upstash the sign-in limit only
  counts per server instance.
- `BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN` must be set **before the build**: the image optimiser only accepts photos from that store.
- Old sign-in cookies stopped working with the 2026-11-03 change; sign in once more.
- Protect `main` on GitHub (no direct or force pushes), give the database user no DROP/TRUNCATE rights, and keep the
  production database link out of `.env.local`.
- After deploying, check: `/admin/services` signed out (private window) shows only the sign-in card; response headers
  include `Strict-Transport-Security` and `Content-Security-Policy`.

## Contact list (2026-11-04)

Admin → Inbox → Contact list shows every contact message and free-trial request, newest first (`lib/server/contacts.ts`,
table `contacts`). Create the table once with `npm run db:setup` in `apps/web`. A message counts as received if it reaches
any one of: the upload folder, the email alert, or this list.

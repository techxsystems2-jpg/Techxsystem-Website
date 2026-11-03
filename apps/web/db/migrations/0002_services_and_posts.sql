-- TechX website: services and blog posts as their own records (owner, 2026-11-03: "all the services record and all the
-- things include the blog should be saved here"). One row per service and one per post, with the fields people look
-- up as real columns; the long, nested parts (page header, what's included, questions) stay as jsonb.
-- Everything else the admin edits stays in site_content (0001). Photos are stored as links (Blob / Drive), not files.
-- Safe to run more than once.

create table if not exists services (
  slug        text primary key,                -- page address: /services/<slug>
  position    integer not null default 0,      -- order on the site (menu, grid, price list)
  name        text not null,
  short_name  text not null default '',        -- name in menus
  line        text not null default '',        -- one line on cards
  starting_at text not null default '',        -- "From $0.50 / image" (always a starting price)
  turnaround  text not null default '',
  tag         text not null default '',        -- "New", "Most ordered"…
  image       text not null default '',        -- photo link (Blob / Drive / site file)
  scene       text not null default '',        -- which built-in animation the card plays
  show_levels boolean not null default false,  -- show the editing levels on its page
  work        text[] not null default '{}',    -- Work gallery categories shown on its page
  hero        jsonb not null default '{}',     -- page header: lead, rest, lede
  fixes       jsonb not null default '{}',     -- what's included: lead, rest, items[]
  faqs        jsonb not null default '[]',     -- questions: [{q, a}]
  note        text not null default '',
  seo_title       text not null default '',
  seo_description text not null default '',
  updated_at  timestamptz not null default now()
);
create index if not exists services_position on services (position);

create table if not exists blog_posts (
  slug         text primary key,               -- /blog/<slug>
  title        text not null,
  excerpt      text not null default '',
  cover        text not null default '',       -- photo link
  published_on date not null default current_date,
  author       text not null default '',
  tags         text[] not null default '{}',
  body         text not null default '',       -- the post, in the admin's simple formatting
  published    boolean not null default false, -- drafts stay off the site
  seo_title       text not null default '',
  seo_description text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists blog_posts_published on blog_posts (published, published_on desc);

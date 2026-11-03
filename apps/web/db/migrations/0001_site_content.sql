-- TechX website: admin-managed content (owner, 2026-11-03).
-- One row per content section (techx:content:facts, :services, :pricing, :blog, :seo …) and the free-trial upload
-- settings (techx:upload-settings). The value is the section's JSON as the admin saved it; a JSON null means
-- "reset to the built-in default". Safe to run more than once.
create table if not exists site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

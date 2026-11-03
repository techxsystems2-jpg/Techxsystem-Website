-- Everyone who filled in a form on the site (owner, 2026-11-04: "a contact list of whoever filled the form"):
-- contact messages and free-trial requests. Read-only list in the admin at /admin/contacts. Safe to run again.
create table if not exists contacts (
  id         bigserial primary key,
  kind       text not null,                   -- 'contact' | 'trial'
  name       text not null default '',
  email      text not null default '',
  studio     text not null default '',
  volume     text not null default '',        -- photos a month (trial form)
  message    text not null default '',        -- contact message, or trial notes
  link       text not null default '',        -- shared folder link (trial form)
  files      integer not null default 0,      -- files uploaded with the trial
  folder     text not null default '',        -- where it was saved in Dropbox / Google Drive
  created_at timestamptz not null default now()
);
create index if not exists contacts_created on contacts (created_at desc);

import postgres from "postgres";

/* PostgreSQL connection for the admin-managed content (owner, 2026-11-03: "I will paste the db link in the .env file").
   Set DATABASE_URL to the database's connection link (Neon, Supabase, Vercel Postgres, Railway…). One small pool per
   server instance, reused across requests (and across hot reloads in development). Statements aren't prepared, so
   transaction-mode poolers (Supabase's port 6543, Neon's -pooler host, PgBouncer) work as well as direct links.
   The table is created once by the owner: db/migrations/0001_site_content.sql, or `npm run db:setup`
   (scripts/db-setup.mjs). The app never changes the schema by itself. */

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __techxSql?: Sql };

export const hasDatabase = () => !!process.env.DATABASE_URL;

export function db(): Sql {
  if (!g.__techxSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    g.__techxSql = postgres(url, {
      max: 3, // serverless: a few connections per instance is plenty
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      // hosted databases need TLS; a link that says nothing about it gets "require" unless it's this machine
      ssl: /sslmode=|localhost|127\.0\.0\.1/.test(url) ? undefined : "require",
      onnotice: () => {},
    });
  }
  return g.__techxSql;
}

/** "missing table" errors get a message the admin can act on. */
export function explainDbError(e: unknown): string {
  const code = (e as { code?: string })?.code;
  if (code === "42P01") return "The database is connected but its table isn't set up yet. Run `npm run db:setup` once (docs/admin.md).";
  if (code === "28P01" || code === "28000") return "The database refused the login. Check DATABASE_URL in .env.";
  if (code === "ENOTFOUND" || code === "ECONNREFUSED" || code === "CONNECT_TIMEOUT") return "Couldn't reach the database. Check DATABASE_URL in .env and that the database is running.";
  return "The database couldn't save that. Try again in a moment.";
}

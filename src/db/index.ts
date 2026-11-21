import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Returns true when a Postgres connection string is configured.
 * The app runs in two modes:
 *  - with DATABASE_URL: full read/write mode (seeded Postgres)
 *  - without: read-only static mode using the bundled portfolio dataset,
 *    so `next build` and hosting on Vercel/Netlify never crash on import.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

const globalForDb = globalThis as typeof globalThis & {
  __miiiPool?: Pool;
  __miiiDb?: NodePgDatabase<typeof schema>;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Set it to a Postgres connection string " +
        "to enable the database-backed features (guestbook, resource submissions, resonance counts)."
    );
  }
  if (!globalForDb.__miiiPool) {
    globalForDb.__miiiPool = new Pool({ connectionString: databaseUrl });
  }
  return globalForDb.__miiiPool;
}

/** Lazily creates (and caches) the Drizzle client. Throws if unconfigured. */
export function getDb(): NodePgDatabase<typeof schema> {
  if (!globalForDb.__miiiDb) {
    globalForDb.__miiiDb = drizzle(createPool(), { schema });
  }
  return globalForDb.__miiiDb;
}

/**
 * Eager `db` export (kept for existing imports). Safe to import without
 * DATABASE_URL — it only throws when a query is actually attempted.
 */
export const db: NodePgDatabase<typeof schema> = new Proxy(
  {},
  {
    get(_target, prop) {
      const live = getDb();
      const value = (live as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === "function" ? value.bind(live) : value;
    },
  }
) as NodePgDatabase<typeof schema>;

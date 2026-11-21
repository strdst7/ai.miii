import { defineConfig } from "drizzle-kit";

// Env-based config for hosted databases (Vercel Postgres, Neon, Supabase…).
// Falls back to the local Postgres URL for development.
// Replaces drizzle.config.json — use:  npx drizzle-kit push --config drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});

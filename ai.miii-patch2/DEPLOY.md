# Deploying miii.ai

Two modes, same codebase:

| Mode | `DATABASE_URL` set? | Behaviour |
|---|---|---|
| **Full** | Yes | Postgres-backed guestbook, resource submissions, resonance counts, auto-seeding |
| **Static** | No | Whole site renders from the bundled dataset; write features show a friendly "needs a database" note |

The build (`next build`) succeeds in both modes, so you can deploy first and
attach a database later with zero downtime.

## Option A — Vercel (recommended)

1. Push this project to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repo.
   Framework is auto-detected as Next.js (`vercel.json` is already in the repo).
3. **Environment variables** (Project → Settings → Environment Variables):
   - `DATABASE_URL` — **required for full mode**. Easiest: Vercel dashboard →
     **Storage → Create → Postgres** (or Neon/Supabase), then connect it to the
     project. Or paste any Postgres connection string.
   - `ANTHROPIC_API_KEY` — **optional**. Enables live Claude answers in the
     "Ask miii.ai" assistant. Without it, the built-in knowledge base answers.
4. **Deploy.**
5. **Create the tables** (one time, after the first deploy):
   ```bash
   DATABASE_URL="<paste-the-same-connection-string>" npx drizzle-kit push --config drizzle.config.ts
   ```
   The app auto-seeds all content (roadmap, 57 certifications, resources, field
   notes) on first request — no SQL files to run.
6. Redeploy not required — data appears on the next visit.

## Option B — Netlify

1. Push this project to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project**. Build settings are read from `netlify.toml`
   (`npm run build`, Node 20).
3. **Environment variables** (Site → Settings → Environment variables):
   - `DATABASE_URL` — same as above (Neon and Supabase both work well with Netlify).
   - `ANTHROPIC_API_KEY` — optional, same as above.
4. **Deploy.**
5. **Create the tables** with the same one-time command as step 5 above.

## Custom domain (miii.ai)

- **Vercel:** Project → Settings → Domains → add `miii.ai` (and `www`), then
  point your registrar's nameservers/A-record at Vercel.
- **Netlify:** Site → Domain settings → Add custom domain, then point DNS at Netlify.

## Local development

```bash
cp .env.example .env   # then edit DATABASE_URL if needed
npm run dev
npx drizzle-kit push --config drizzle.config.ts  # create local tables once
```

## Health check

`GET /api/health` returns:

```json
{ "ok": true, "db": "connected" }            // full mode
{ "ok": true, "db": "unconfigured-static-mode" } // static mode
```

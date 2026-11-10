# miii.ai redesigned preview

This Next.js site applies the supplied MiiiExperience / Canvas design to the miii.ai portfolio. The original static site remains in `/home/user/miii-ai` and was not overwritten.

## Run locally

```sh
npm install
npm run dev -- --hostname 0.0.0.0 --port 8000
```

The production build can be checked with `npm run build` and `npm run typecheck`.

## What was adapted

- Reconstructed the supplied layout, gradient, typography, roadmap, projects, credentials and canvas components.
- Added the missing 3D key component and an offline data source so the preview does not require an absent PostgreSQL database.
- Retained the user's contact email (`miii@aimirah.com`), GitHub profile and text-based external-link cues rather than redirect arrows.
- Used the 50 entries in the supplied LinkedIn PDF, including issue months and caveats. Direct credential links are used where known. The Oracle Credly item is labelled unverified; the possible Analytics duplicate and conflicting Gemini badge dates are noted.
- Kept the portfolio, certification and field-note content readable without a database.

## Integration limits

The supplied files did not contain the original chat, guestbook or notes API routes, a database connection, or an AI provider. The guide uses local topic-based answers and is explicitly labelled as such; it is not generative AI. Resource suggestions, guestbook notes and reactions exist only in the current browser session and are not transmitted or persisted. Connect a moderated database and an AI provider before offering shared/persistent submissions or a live assistant. The source does not publish anything and does not configure a custom domain.

A small number of public services (notably LinkedIn) block automated checks; confirm them in a browser. Fonts are loaded from Google Fonts when available, with local system fallbacks.

## Canvas and preview fixes
All four Canvas windows now open by default and stack on smaller screens. Window actions navigate to their matching home sections; LinkedIn-only credentials link to the LinkedIn profile with an explicit label, not a claimed direct certificate. The footer key uses the supplied glyph's intended 3D wrapper. The development server allows the preview proxy origin.

## Run with Docker

With Docker Engine and Docker Compose installed:

```sh
docker compose up --build -d
```

The container serves the production build on port 7077, bound to all host interfaces (`http://localhost:7077` on the host). Access from another machine requires a reachable host address and firewall rules permitting TCP 7077; `0.0.0.0` is a bind address, not a public URL. Stop it with `docker compose down`.

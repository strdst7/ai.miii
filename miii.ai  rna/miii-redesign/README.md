# miii.ai library

The home page opens the locally captured Spiral Archive at `/alice/library`. Phones use `/m/alice/library`. Both routes retain the Vue, Three.js and WebGL animation. The local stylesheet hides the captured portfolio navigation and account controls. A profile button opens Mia's biography and links inside the library. The library catalog uses this project's projects, learning modules, writing, resources, field notes and credentials. The previous Canvas design remains at `/classic`.

The captured site belongs to its original owner. The archive is mounted read-only from outside this public repository; do not commit its scripts, images, music or branding. The adaptation is for local preview. Replace the original assets with licensed originals before publishing an equivalent site.

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

The container serves the production build at `http://localhost:7077`, bound to the host loopback interface. It mounts the local archive at `~/remakes/afifmaahi-portfolio-com-alice-library/site`. Set `SPIRAL_ARCHIVE_SITE` to another absolute path before running Compose if the archive lives elsewhere. Stop it with `docker compose down`.

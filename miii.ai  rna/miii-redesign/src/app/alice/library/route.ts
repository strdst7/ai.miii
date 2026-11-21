import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.has("archive")) {
    const archive = process.env.SPIRAL_ARCHIVE_DIR;
    if (!archive) return new Response("Set SPIRAL_ARCHIVE_DIR to a local Spiral Archive site directory.", { status: 503 });
    try {
      const html = await readFile(path.join(archive, "alice/library/index.html"), "utf8");
      const localHtml = html
        .replace(/<script src="\/_remake\/runtime\.js"><\/script>/, "")
        .replace(/<head>/, '<head><script>history.replaceState(history.state, "", "/alice/library")</script>')
        .replace(/<\/head>/, '<link rel="stylesheet" href="/library-shell.css"><script defer src="/library-profile.js"></script></head>')
        .replace("Portfolio Management System - Kiyo Software TechLab", "The Spiral Archive | miii.ai");
      return new Response(localHtml, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
    } catch {
      return new Response("Spiral Archive files are unavailable. Check SPIRAL_ARCHIVE_SITE in docker-compose.yml.", { status: 503 });
    }
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex, nofollow"><title>The Spiral Archive | miii.ai</title><link rel="stylesheet" href="/library-ocean.css"><script defer src="/library-ocean.js"></script></head><body><main><section class="library-ocean" id="library-ocean" aria-label="Ocean landing"><iframe title="Interactive ocean landing" src="/alice/ocean" allow="autoplay; fullscreen" loading="eager"></iframe><div class="library-ocean-entry"><span>THE SPIRAL ARCHIVE</span><a id="library-enter" href="/classic">Enter the library <span aria-hidden="true">↗</span></a></div></section><section id="library-archive" aria-label="Spiral Archive"><iframe title="Spiral Archive library" data-src="/alice/library?archive=1"></iframe></section></main></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
}

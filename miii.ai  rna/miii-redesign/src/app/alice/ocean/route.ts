import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const ocean = process.env.OCEAN_SITE_DIR;
  if (!ocean) return new Response("Set OCEAN_SITE_DIR to the local ocean site directory.", { status: 503 });
  try {
    const html = await readFile(path.join(ocean, "index.html"), "utf8");
    const localHtml = html
      .replace(/(["'])\/(assets|beach|audio|images|_ext|_remake)\//g, "$1/api/ocean/$2/")
      .replace(/<head>/, '<head><script>history.replaceState(history.state, "", "/")</script>');
    return new Response(localHtml, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
  } catch {
    return new Response("Ocean files are unavailable. Check OCEAN_SITE in docker-compose.yml.", { status: 503 });
  }
}

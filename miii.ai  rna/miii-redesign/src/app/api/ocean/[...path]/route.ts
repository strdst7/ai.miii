import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const ocean = process.env.OCEAN_SITE_DIR;
  if (!ocean) return new Response("Ocean site is not mounted.", { status: 503 });
  const segments = (await params).path;
  if (!segments.length || segments.some((segment) => segment === "." || segment === ".." || segment.startsWith("."))) {
    return new Response("Invalid ocean path.", { status: 400 });
  }
  const file = path.resolve(ocean, ...segments);
  if (!file.startsWith(path.resolve(ocean) + path.sep)) return new Response("Invalid ocean path.", { status: 400 });
  try {
    const data = await readFile(file);
    const extension = path.extname(file);
    const body = extension === ".js" || extension === ".css"
      ? Buffer.from(data.toString("utf8").replace(/(["'(])\/(assets|beach|audio|images|_ext|_remake)\//g, "$1/api/ocean/$2/"))
      : data;
    return new Response(body, { headers: { "content-type": contentTypes[extension] || "application/octet-stream", "x-robots-tag": "noindex, nofollow" } });
  } catch {
    return new Response("Ocean file unavailable.", { status: 404 });
  }
}

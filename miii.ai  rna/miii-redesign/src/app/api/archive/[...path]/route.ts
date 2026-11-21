import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".json": "application/json",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const archive = process.env.SPIRAL_ARCHIVE_DIR;
  if (!archive) return new Response("Spiral Archive is not mounted.", { status: 503 });
  const segments = (await params).path;
  if (!segments.length || segments.some((segment) => segment === "." || segment === ".." || segment.startsWith("."))) {
    return new Response("Invalid archive path.", { status: 400 });
  }
  const file = path.join(archive, ...segments);
  if (!file.startsWith(path.resolve(archive) + path.sep)) return new Response("Invalid archive path.", { status: 400 });
  try {
    const data = await readFile(file);
    return new Response(data, { headers: { "content-type": contentTypes[path.extname(file)] || "application/octet-stream", "x-robots-tag": "noindex, nofollow" } });
  } catch {
    return new Response("Archive file unavailable.", { status: 404 });
  }
}

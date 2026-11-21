export const dynamic = "force-static";

export function GET() {
  return Response.json({ portraitUrl: null, palette: [], skills: [], avatars: [], rotationSeconds: 0 });
}

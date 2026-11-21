export const dynamic = "force-static";

export function GET() {
  return Response.json({ enabled: false, clientId: "", signUpsOpen: false });
}

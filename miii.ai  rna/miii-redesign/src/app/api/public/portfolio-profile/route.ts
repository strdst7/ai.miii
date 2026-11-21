import { portfolioData } from "@/app/page";

export const dynamic = "force-static";

export function GET() {
  const { fullName, preferredName, roleTitle, company, location, bioShort, links } = portfolioData.profile;
  return Response.json({ fullName, preferredName, roleTitle, company, location, bioShort, links });
}

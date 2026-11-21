import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import {
  roadmapModules,
  certifications,
  learningResources,
  fieldNotes,
  guestbookMessages,
} from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import {
  ensureSeeded,
  VERIFIED_PROFILE,
  VERIFIED_PROJECTS,
  VERIFIED_WRITING,
  VERIFICATION_AUDIT,
} from "@/db/seed";
import { getStaticPortfolioPayload } from "@/db/static-portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ...getStaticPortfolioPayload(), static: true });
  }

  try {
    await ensureSeeded();

    const [modules, certs, resources, notes, messages] = await Promise.all([
      db.select().from(roadmapModules).orderBy(asc(roadmapModules.sortOrder)),
      db.select().from(certifications).orderBy(asc(certifications.sortOrder)),
      db
        .select()
        .from(learningResources)
        .orderBy(asc(learningResources.id)),
      db.select().from(fieldNotes).orderBy(asc(fieldNotes.sortOrder)),
      db
        .select()
        .from(guestbookMessages)
        .orderBy(desc(guestbookMessages.createdAt))
        .limit(20),
    ]);

    return NextResponse.json({
      profile: VERIFIED_PROFILE,
      projects: VERIFIED_PROJECTS,
      writing: VERIFIED_WRITING,
      audit: VERIFICATION_AUDIT,
      modules,
      certifications: certs,
      resources,
      fieldNotes: notes,
      guestbook: messages,
    });
  } catch (error) {
    console.error("[miii.ai] Failed to load portfolio data:", error);
    return NextResponse.json({
      ...getStaticPortfolioPayload(),
      static: true,
    });
  }
}

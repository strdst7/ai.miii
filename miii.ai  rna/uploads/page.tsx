import React from "react";
import { db } from "@/db";
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
import { MiiiExperience } from "@/components/MiiiExperience";
import type { PortfolioPayload } from "@/types/portfolio";

export const dynamic = "force-dynamic";

async function getPortfolioPayload(): Promise<PortfolioPayload> {
  await ensureSeeded();

  const [modules, certs, resources, notes, messages] = await Promise.all([
    db.select().from(roadmapModules).orderBy(asc(roadmapModules.sortOrder)),
    db.select().from(certifications).orderBy(asc(certifications.sortOrder)),
    db.select().from(learningResources).orderBy(asc(learningResources.id)),
    db.select().from(fieldNotes).orderBy(asc(fieldNotes.sortOrder)),
    db
      .select()
      .from(guestbookMessages)
      .orderBy(desc(guestbookMessages.createdAt))
      .limit(20),
  ]);

  return {
    profile: VERIFIED_PROFILE,
    projects: VERIFIED_PROJECTS,
    writing: VERIFIED_WRITING,
    audit: VERIFICATION_AUDIT,
    modules,
    certifications: certs,
    resources: resources.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    fieldNotes: notes,
    guestbook: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

export default async function HomePage() {
  const initialData = await getPortfolioPayload();
  return <MiiiExperience initialData={initialData} />;
}

import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { fieldNotes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Reactions need a database. They are counted locally for this visit." },
      { status: 503 }
    );
  }
  try {
    await ensureSeeded();
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid note id." }, { status: 400 });
    }

    const [updated] = await db
      .update(fieldNotes)
      .set({
        resonatesCount: sql`${fieldNotes.resonatesCount} + 1`,
      })
      .where(eq(fieldNotes.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error("[miii.ai] Failed to update field note:", error);
    return NextResponse.json(
      { error: "Unable to record reaction." },
      { status: 500 }
    );
  }
}

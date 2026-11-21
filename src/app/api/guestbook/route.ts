import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { guestbookMessages } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

const DB_UNAVAILABLE =
  "The guestbook needs a database. Set DATABASE_URL on your hosting provider to enable it.";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: DB_UNAVAILABLE }, { status: 503 });
  }
  try {
    await ensureSeeded();
    const body = await request.json();

    const senderName = String(body.senderName ?? "").trim();
    const senderRole = String(body.senderRole ?? "Builder / Visitor").trim();
    const topic = String(body.topic ?? "Collaboration").trim();
    const message = String(body.message ?? "").trim();

    if (!senderName || !message) {
      return NextResponse.json(
        { error: "Your name and message are required." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(guestbookMessages)
      .values({
        senderName: senderName.slice(0, 80),
        senderRole: senderRole.slice(0, 100),
        topic: topic.slice(0, 60),
        message: message.slice(0, 600),
      })
      .returning();

    return NextResponse.json({ entry: created }, { status: 201 });
  } catch (error) {
    console.error("[miii.ai] Failed to save guestbook message:", error);
    return NextResponse.json(
      { error: "Could not send message." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { learningResources } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const provider = String(body.provider ?? "").trim();
    const category = String(body.category ?? "AI Engineering").trim();
    const url = String(body.url ?? "").trim();
    const whyItWorked = String(body.whyItWorked ?? "").trim();

    if (!title || !provider || !url || !whyItWorked) {
      return NextResponse.json(
        { error: "Please fill in title, platform/provider, URL, and why it is useful." },
        { status: 400 }
      );
    }

    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { error: "Please enter a valid http:// or https:// URL." },
        { status: 400 }
      );
    }

    const allowedCategories = [
      "Fundamentals",
      "Software Dev",
      "AI Engineering",
      "Cloud & Data",
    ];
    const safeCategory = allowedCategories.includes(category)
      ? category
      : "AI Engineering";

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)}-${Date.now().toString(36)}`;

    const [created] = await db
      .insert(learningResources)
      .values({
        slug,
        title: title.slice(0, 140),
        provider: provider.slice(0, 100),
        category: safeCategory,
        costType: "Free",
        url: url.slice(0, 300),
        whyItWorked: whyItWorked.slice(0, 400),
        recommendedByVisitor: true,
      })
      .returning();

    return NextResponse.json({ resource: created }, { status: 201 });
  } catch (error) {
    console.error("[miii.ai] Failed to save resource:", error);
    return NextResponse.json(
      { error: "Could not save resource recommendation." },
      { status: 500 }
    );
  }
}

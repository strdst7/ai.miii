import { portfolioData } from "@/app/page";

export const dynamic = "force-static";

const shelves = [
  { key: "architecture", label: "Systems", blurb: "Projects, architecture, and things built to work.", color: "#6D5DF6" },
  { key: "workflow", label: "Learning", blurb: "A practical path through the fundamentals and beyond.", color: "#2F9E8F" },
  { key: "mobile", label: "Writing", blurb: "Published articles and reflections on the work.", color: "#00A6A6" },
  { key: "setup", label: "Resources", blurb: "Courses and references that helped me learn.", color: "#8D99AE" },
  { key: "prompt", label: "Field Notes", blurb: "Short lessons from building and testing.", color: "#FF8FAB" },
  { key: "wisdom", label: "Credentials", blurb: "The record of study, with sources where available.", color: "#9B5DE5" },
];

type Book = {
  ref: string;
  shelf: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  wordCount: number;
  readingMinutes: number;
  updatedAt: string;
  coverUrl: string | null;
  pages: number;
  images: never[];
  priceCents: number;
  currency: string;
  free: boolean;
  forWhom: string;
  pairsWith: never[];
  ratingAverage: number;
  ratingCount: number;
};

function book(shelf: string, slug: string, title: string, subtitle: string, summary: string, tags: string[] = []): Book {
  const wordCount = summary.trim().split(/\s+/).length;
  return {
    ref: `${shelf}/books/${slug}`,
    shelf, title, subtitle, summary, tags, wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    updatedAt: "2026-11-01T00:00:00Z",
    coverUrl: null,
    pages: 1,
    images: [],
    priceCents: 0,
    currency: "usd",
    free: true,
    forWhom: "Anyone exploring software development and AI engineering.",
    pairsWith: [],
    ratingAverage: 0,
    ratingCount: 0,
  };
}

export const libraryBooks: Book[] = [
  ...portfolioData.projects.map((item) => book("architecture", item.id, item.title, item.subtitle, item.description, item.stack)),
  ...portfolioData.modules.map((item) => book("workflow", item.code.toLowerCase(), item.title, item.phase, `${item.summary} ${item.deliverableDesc}`, item.tools)),
  ...portfolioData.writing.map((item, index) => book("mobile", `essay-${index + 1}`, item.title, item.platform, item.blurb)),
  ...portfolioData.resources.map((item) => book("setup", item.slug, item.title, item.provider, item.whyItWorked, [item.category])),
  ...portfolioData.fieldNotes.map((item) => book("prompt", item.slug, item.title, item.dateLabel, `${item.context} ${item.whatHappened} ${item.takeaway}`, [item.tag])),
  ...portfolioData.certifications.map((item) => book("wisdom", item.slug, item.title, item.issuer, `${item.issuedDate}. ${item.verificationNote || "Listed in my learning record."}`, [item.category])),
];

export function GET() {
  return Response.json({
    shelves: shelves.map((shelf) => ({ ...shelf, bookCount: libraryBooks.filter((item) => item.shelf === shelf.key).length })),
    books: libraryBooks,
    storeOpen: false,
    chatOpen: false,
    soundtrack: [],
    guestFreeShare: 0,
  });
}

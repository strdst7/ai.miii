import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const roadmapModules = pgTable("roadmap_modules", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // M00 - M09
  phase: text("phase").notNull(), // e.g. "Fundamentals", "Software Dev", "AI Engineering", "Building"
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  summary: text("summary").notNull(),
  deliverableTitle: text("deliverable_title").notNull(),
  deliverableDesc: text("deliverable_desc").notNull(),
  tools: jsonb("tools").$type<string[]>().notNull(),
  status: text("status").notNull(), // "Shipped" | "Active Loop" | "Continuous"
  sortOrder: integer("sort_order").notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issuedDate: text("issued_date").notNull(),
  expires: text("expires"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  category: text("category").notNull(), // "AI & Agents" | "Cloud & Data" | "Recognition" | "Aviation & Leadership"
  summary: text("summary").notNull(),
  isNewUpdate: boolean("is_new_update").notNull().default(false),
  verificationNote: text("verification_note"),
  sortOrder: integer("sort_order").notNull(),
});

export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  category: text("category").notNull(), // "Fundamentals" | "Software Dev" | "AI Engineering" | "Cloud & Data"
  costType: text("cost_type").notNull(), // "Free" | "Free Tier / Open"
  url: text("url").notNull(),
  whyItWorked: text("why_it_worked").notNull(),
  recommendedByVisitor: boolean("recommended_by_visitor").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fieldNotes = pgTable("field_notes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  dateLabel: text("date_label").notNull(),
  tag: text("tag").notNull(), // "What Worked" | "What Didn't" | "Lesson Learned"
  title: text("title").notNull(),
  context: text("context").notNull(),
  whatHappened: text("what_happened").notNull(),
  takeaway: text("takeaway").notNull(),
  resonatesCount: integer("resonates_count").notNull().default(12),
  sortOrder: integer("sort_order").notNull(),
});

export const guestbookMessages = pgTable("guestbook_messages", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderRole: text("sender_role").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

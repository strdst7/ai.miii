import {
  VERIFIED_PROFILE,
  VERIFIED_PROJECTS,
  VERIFIED_WRITING,
  VERIFICATION_AUDIT,
  STATIC_ROADMAP_MODULES,
  STATIC_LEARNING_RESOURCES,
  STATIC_FIELD_NOTES,
  STATIC_GUESTBOOK_SEED,
} from "./seed";
import { CERTIFICATION_ROWS } from "./certifications-data";
import type { PortfolioPayload } from "@/types/portfolio";

/**
 * Builds the full portfolio payload from the bundled static dataset —
 * no database required. Used when DATABASE_URL is not configured
 * (e.g. a fresh Vercel/Netlify deploy before Postgres is attached).
 * The page renders identically; only the write features
 * (guestbook posts, resource submissions, resonance counts) are disabled.
 */
export function getStaticPortfolioPayload(): PortfolioPayload {
  return {
    profile: VERIFIED_PROFILE,
    projects: VERIFIED_PROJECTS,
    writing: VERIFIED_WRITING,
    audit: VERIFICATION_AUDIT,
    modules: STATIC_ROADMAP_MODULES.map((m, i) => ({ id: i + 1, ...m })),
    certifications: CERTIFICATION_ROWS.map((c, i) => ({ id: i + 1, ...c })),
    resources: STATIC_LEARNING_RESOURCES.map((r, i) => ({
      id: i + 1,
      createdAt: new Date().toISOString(),
      ...r,
    })),
    fieldNotes: STATIC_FIELD_NOTES.map((n, i) => ({ id: i + 1, ...n })),
    guestbook: STATIC_GUESTBOOK_SEED.map((g, i) => ({
      id: i + 1,
      createdAt: new Date().toISOString(),
      ...g,
    })),
  };
}

/**
 * Certification dataset for miii.ai.
 *
 * Source of truth: the credential list supplied by Nur Amirah Mohd Kamil
 * (LinkedIn "Licenses & Certifications", Nov 2026), plus a small set of
 * earlier credentials already documented on aimirah.com / LinkedIn.
 *
 * Rules followed here:
 *  - Titles, issuers, months and expiry dates are transcribed exactly as given.
 *  - Nothing is invented: no credential IDs, scores or descriptions are added.
 *  - `credentialUrl` is only a *direct* credential link when one was provided.
 *    None were, so each entry links to the best known public record (issuer
 *    profile or the LinkedIn profile) and `verificationNote` says so plainly.
 *
 * The list is ordered newest → oldest; `sortOrder` is derived from position.
 */

export const LINKEDIN_PROFILE = "https://www.linkedin.com/in/nur-amirah-mohd-kamil-/";
export const READY_TENSOR_PROFILE = "https://app.readytensor.ai/users/nuramirahmohdkamil";
export const CREDLY_PROFILE = "https://www.credly.com/users/nur-amirah-mohd-kamil/badges";

export const CERT_CATEGORIES = [
  "AI & Agents",
  "Data & Analytics",
  "Cloud & Security",
  "Software & Web",
  "Business & Leadership",
  "Community & Recognition",
] as const;

export type CertCategory = (typeof CERT_CATEGORIES)[number];

interface CertInput {
  title: string;
  issuer: string;
  issued: string;
  category: CertCategory;
  expires?: string;
  url?: string;
  /** Overrides the default verification note. */
  note?: string;
  latest?: boolean;
}

const DEFAULT_NOTE =
  "From the LinkedIn credential list provided by Mia. A direct credential URL was not supplied, so this links to the public profile.";

// prettier-ignore
const LIST: CertInput[] = [
  // ── November 2026 ────────────────────────────────────────────────
  { issued: "Nov 2026", title: "Data Science and AI For Decision Making", issuer: "Harvard Business School Online", category: "Data & Analytics", latest: true },
  { issued: "Nov 2026", title: "Claude Academy: Claude 101", issuer: "Anthropic", category: "AI & Agents", latest: true },

  // ── October 2026 ─────────────────────────────────────────────────
  { issued: "Oct 2026", title: "CS50 Introduction to Computer Science", issuer: "Harvard University", category: "Software & Web" },
  { issued: "Oct 2026", title: "CS50W: CS50’s Web Programming with Python and JavaScript", issuer: "HarvardX", category: "Software & Web" },
  { issued: "Oct 2026", title: "Prompt & AI Engineering Safety Professional Certification", issuer: "Institute of Management, Technology and Finance", category: "AI & Agents" },
  { issued: "Oct 2026", title: "Foundations of Software Development", issuer: "CodeSignal", category: "Software & Web" },
  { issued: "Oct 2026", title: "AI Leadership", issuer: "OpenAI", category: "AI & Agents", expires: "Apr 2027" },
  { issued: "Oct 2026", title: "Claude Academy: AI capabilities and limitations", issuer: "Anthropic", category: "AI & Agents" },
  { issued: "Oct 2026", title: "Oracle Agentic AI Certified Foundations Associate", issuer: "Oracle", category: "AI & Agents", expires: "Oct 2028" },
  { issued: "Oct 2026", title: "Claude Academy: Claude Code in action", issuer: "Anthropic", category: "AI & Agents" },
  { issued: "Oct 2026", title: "Claude Academy: AI Fluency: Framework and foundations", issuer: "Anthropic", category: "AI & Agents" },
  { issued: "Oct 2026", title: "Claude Academy: Building effective human-agent teams (beta)", issuer: "Anthropic", category: "AI & Agents" },
  { issued: "Oct 2026", title: "CRUD Operations in MongoDB", issuer: "MongoDB", category: "Software & Web" },
  { issued: "Oct 2026", title: "Astronomer Certified for AI Orchestration Fundamentals", issuer: "Astronomer", category: "AI & Agents" },

  // ── September 2026 ───────────────────────────────────────────────
  { issued: "Sep 2026", title: "Kracked Labs - Builders Sandbox: Certificate of Participation", issuer: "krackeddevs", category: "Community & Recognition" },
  { issued: "Sep 2026", title: "Understanding Digital Transformation", issuer: "MyDIGITAL Corporation", category: "Business & Leadership" },
  { issued: "Sep 2026", title: "Build a Secure Google Cloud Network Skill Badge", issuer: "Google", category: "Cloud & Security", url: CREDLY_PROFILE, note: "From the LinkedIn credential list provided by Mia. Linked to the Credly badge profile; a direct badge URL was not supplied." },

  // ── August 2026 ──────────────────────────────────────────────────
  { issued: "Aug 2026", title: "Mentor [Human Agent] for The Malaysian Learn-a-thon!", issuer: "krackeddevs", category: "Community & Recognition" },

  // ── July 2026 ────────────────────────────────────────────────────
  { issued: "Jul 2026", title: "IQ Test Certificate", issuer: "MyIQ", category: "Community & Recognition" },

  // ── May 2026 ─────────────────────────────────────────────────────
  { issued: "May 2026", title: "Google Advanced Data Analytics Professional Certificate (v.2)", issuer: "Coursera", category: "Data & Analytics" },
  { issued: "May 2026", title: "Google Advanced Data Analytics", issuer: "Google", category: "Data & Analytics", url: CREDLY_PROFILE, note: "Also shown on aimirah.com with a Credly link. Linked to the Credly badge profile; a direct badge URL was not supplied." },
  { issued: "May 2026", title: "Agentic AI Builder", issuer: "Ready Tensor, Inc.", category: "AI & Agents", url: READY_TENSOR_PROFILE, note: "From the LinkedIn credential list provided by Mia. Linked to the Ready Tensor profile; a direct credential URL was not supplied." },
  { issued: "May 2026", title: "Google Advanced Data Analytics Capstone", issuer: "Google", category: "Data & Analytics" },
  { issued: "May 2026", title: "The Nuts and Bolts of Machine Learning", issuer: "Google", category: "Data & Analytics" },

  // ── April 2026 ───────────────────────────────────────────────────
  { issued: "Apr 2026", title: "Regression Analysis: Simplify Complex Data Relationships", issuer: "Google", category: "Data & Analytics" },
  { issued: "Apr 2026", title: "The Power of Statistics", issuer: "Google", category: "Data & Analytics" },
  { issued: "Apr 2026", title: "Go Beyond the Numbers: Translate Data into Insights", issuer: "Google", category: "Data & Analytics" },

  // ── March 2026 ───────────────────────────────────────────────────
  { issued: "Mar 2026", title: "Agentic AI Engineer", issuer: "Ready Tensor, Inc.", category: "AI & Agents", url: READY_TENSOR_PROFILE, note: "Announced on LinkedIn and tied to the AI-OS publication on Ready Tensor. Linked to the Ready Tensor profile; a direct credential URL was not supplied." },
  { issued: "Mar 2026", title: "Gemini for Data Scientists and Analysts", issuer: "Google", category: "AI & Agents" },
  { issued: "Mar 2026", title: "Create Your First Gemini Enterprise Application", issuer: "Google", category: "AI & Agents", url: CREDLY_PROFILE, note: "Gemini Enterprise credentials also appear on aimirah.com with a Credly link. Linked to the Credly badge profile; a direct badge URL was not supplied." },
  { issued: "Mar 2026", title: "Enterprise Agents and Use Cases", issuer: "Google", category: "AI & Agents" },
  { issued: "Mar 2026", title: "Foundations of Data Science", issuer: "Google", category: "Data & Analytics" },
  { issued: "Mar 2026", title: "Create ML Models with BigQuery ML Skill Badge", issuer: "Google", category: "Data & Analytics", url: CREDLY_PROFILE, note: "Announced on LinkedIn as a Google Cloud skill badge. Linked to the Credly badge profile; a direct badge URL was not supplied." },
  { issued: "Mar 2026", title: "Cloud Architecture: Design, Implement, and Manage Skill Badge", issuer: "Google", category: "Cloud & Security", url: CREDLY_PROFILE, note: "Announced on LinkedIn as a Google Cloud skill badge. Linked to the Credly badge profile; a direct badge URL was not supplied." },

  // ── February 2026 ────────────────────────────────────────────────
  { issued: "Feb 2026", title: "RAG Systems Expert", issuer: "Ready Tensor, Inc.", category: "AI & Agents", url: READY_TENSOR_PROFILE, note: "From the LinkedIn credential list provided by Mia. Linked to the Ready Tensor profile; a direct credential URL was not supplied." },
  { issued: "Feb 2026", title: "AI For MY Future", issuer: "Microsoft", category: "AI & Agents" },
  { issued: "Feb 2026", title: "Introduction to Computers and Operating Systems and Security", issuer: "Microsoft", category: "Cloud & Security" },

  // ── January 2026 ─────────────────────────────────────────────────
  { issued: "Jan 2026", title: "Foundations of Project Management", issuer: "Google", category: "Business & Leadership" },
  { issued: "Jan 2026", title: "Google AI for K12 Educators", issuer: "Google", category: "AI & Agents" },
  { issued: "Jan 2026", title: "Gemini Certified Educator", issuer: "Google", category: "AI & Agents", expires: "Jan 2029" },

  // ── December 2025 ────────────────────────────────────────────────
  { issued: "Dec 2025", title: "Agentic AI Developer Certification", issuer: "Ready Tensor, Inc.", category: "AI & Agents", url: READY_TENSOR_PROFILE, note: "Announced in Mia’s LinkedIn post of 19 Dec 2025. Not present in the latest list; kept because the LinkedIn post is public. Linked to the Ready Tensor profile." },

  // ── October 2025 ─────────────────────────────────────────────────
  { issued: "Oct 2025", title: "Blockchain untuk Rakyat", issuer: "Ministry of Science, Technology and Innovation", category: "Software & Web" },
  { issued: "Oct 2025", title: "AI Fluency", issuer: "Ministry of Science, Technology and Innovation", category: "AI & Agents" },
  { issued: "Oct 2025", title: "Cloud untuk Rakyat", issuer: "Ministry of Science, Technology and Innovation", category: "Cloud & Security" },
  { issued: "Oct 2025", title: "Generative AI", issuer: "Ministry of Science, Technology and Innovation", category: "AI & Agents" },
  { issued: "Oct 2025", title: "CyberSAFE untuk Rakyat", issuer: "Ministry of Science, Technology and Innovation", category: "Cloud & Security" },
  { issued: "Oct 2025", title: "AI Appreciate", issuer: "MyDIGITAL Corporation", category: "AI & Agents" },
  { issued: "Oct 2025", title: "AI Aware", issuer: "MyDIGITAL Corporation", category: "AI & Agents" },

  // ── July 2025 ────────────────────────────────────────────────────
  { issued: "Jul 2025", title: "Operational Excellence Foundations", issuer: "LinkedIn", category: "Business & Leadership" },
  { issued: "Jul 2025", title: "Operations Strategy for Business", issuer: "LinkedIn", category: "Business & Leadership" },
  { issued: "Jul 2025", title: "Describe the finance and operations apps", issuer: "Microsoft", category: "Business & Leadership" },

  // ── Earlier credentials (already on LinkedIn / aimirah.com) ──────
  { issued: "Sep 2024", title: "Microsoft Skills for Jobs: Word for Work - Microsoft Essentials", issuer: "Microsoft", category: "Business & Leadership", note: "Listed on LinkedIn (issued Sep 2024)." },
  { issued: "Jan 2021", title: "Certificate of Talent, CliftonStrengths", issuer: "Gallup", category: "Business & Leadership", note: "Listed on LinkedIn (issued Jan 2021)." },
  { issued: "Jan 2013 – Jan 2015", title: "Customer Service Excellence & Emotional Intelligent Communication Certified", issuer: "Qatar Airways", category: "Business & Leadership", note: "Listed on LinkedIn (Customer Service Excellence Jan 2013; Emotional Intelligent Communication Jan 2015)." },
  { issued: "Undated", title: "FIMM iFVE Examination (CUTE)", issuer: "Federation of Investment Managers Malaysia (FIMM)", category: "Business & Leadership", note: "Listed on LinkedIn without an issue date." },
  { issued: "Undated", title: "AI Readiness Assessment — AI Visionary (98/100, Level 6, #001507)", issuer: "Ministry of Digital (Malaysia)", category: "Community & Recognition", url: "https://aimirah.com", note: "Listed on aimirah.com; no issue date or public verification link has been provided." },
  { issued: "Undated", title: "KrackedDevs Vibe-A-Thon — Top 5 & Bounty Winner", issuer: "krackeddevs", category: "Community & Recognition", url: "https://krackeddevs.com/profile/strdst7", note: "Listed on aimirah.com; no issue date has been provided." },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export interface CertSeedRow {
  slug: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expires: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  category: string;
  summary: string;
  isNewUpdate: boolean;
  verificationNote: string | null;
  sortOrder: number;
}

export const CERTIFICATION_ROWS: CertSeedRow[] = LIST.map((c, i) => ({
  slug: `${slugify(c.issuer)}-${slugify(c.title)}-${slugify(c.issued)}`.slice(0, 160),
  title: c.title,
  issuer: c.issuer,
  issuedDate: c.issued,
  expires: c.expires ?? null,
  credentialId: null,
  credentialUrl: c.url ?? LINKEDIN_PROFILE,
  category: c.category,
  summary: "",
  isNewUpdate: c.latest === true,
  verificationNote: c.note ?? DEFAULT_NOTE,
  sortOrder: i + 1,
}));

if (new Set(CERTIFICATION_ROWS.map((r) => r.slug)).size !== CERTIFICATION_ROWS.length) {
  throw new Error("certifications-data: duplicate slug detected");
}

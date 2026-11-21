export interface RoadmapModule {
  id: number;
  code: string;
  phase: string;
  title: string;
  tagline: string;
  summary: string;
  deliverableTitle: string;
  deliverableDesc: string;
  tools: string[];
  status: string;
  sortOrder: number;
}

export interface CertificationItem {
  id: number;
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

export interface LearningResourceItem {
  id: number;
  slug: string;
  title: string;
  provider: string;
  category: string;
  costType: string;
  url: string;
  whyItWorked: string;
  recommendedByVisitor: boolean;
  createdAt?: string;
}

export interface FieldNoteItem {
  id: number;
  slug: string;
  dateLabel: string;
  tag: string;
  title: string;
  context: string;
  whatHappened: string;
  takeaway: string;
  resonatesCount: number;
  sortOrder: number;
}

export interface GuestbookEntry {
  id: number;
  senderName: string;
  senderRole: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  period: string;
  domain: string;
  description: string;
  lesson: string;
  stack: string[];
  repoUrl: string;
  publicationUrl: string;
}

export interface WritingItem {
  platform: string;
  title: string;
  blurb: string;
  url: string;
}

export interface AuditItem {
  item: string;
  status: string;
  source: string;
  actionNeeded: string;
}

export interface ProfileData {
  brand: string;
  previousInspiration: string;
  fullName: string;
  preferredName: string;
  roleTitle: string;
  company: string;
  companyUrl: string;
  location: string;
  positioning: string;
  guidingPrinciple: string;
  bioShort: string;
  links: {
    linkedin: string;
    readyTensor: string;
    readyTensorAlt: string;
    credly: string;
    github: string;
    devto: string;
    existingPortfolio: string;
  };
  stats: Array<{
    value: string;
    label: string;
    note: string;
  }>;
}

export interface PortfolioPayload {
  profile: ProfileData;
  projects: ProjectItem[];
  writing: WritingItem[];
  audit: AuditItem[];
  modules: RoadmapModule[];
  certifications: CertificationItem[];
  resources: LearningResourceItem[];
  fieldNotes: FieldNoteItem[];
  guestbook: GuestbookEntry[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedFollowUps?: string[];
  highlightSection?: string;
}

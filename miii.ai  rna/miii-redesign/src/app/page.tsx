import { MiiiExperience } from "@/components/MiiiExperience";
import { VERIFIED_PROFILE, VERIFIED_PROJECTS, VERIFIED_WRITING, MODULES, RESOURCES } from "@/data/base";
import { CERTIFICATION_ROWS } from "@/data/certifications-data";
import linkedin from "@/data/linkedin.json";
import type { PortfolioPayload, CertificationItem } from "@/types/portfolio";

const certs: CertificationItem[] = linkedin.map(([issued, title, issuer, note, url], index) => {
  const existing = CERTIFICATION_ROWS.find(c => c.title.toLowerCase().replace(/\s/g, "") === title.toLowerCase().replace(/\s/g, ""));
  return { id:index+1, slug:`listed-${index+1}`, title, issuer, issuedDate:issued, expires:note.startsWith("Expires") ? note.split(" · ")[0].replace("Expires ","") : null, credentialId:null, credentialUrl:url || null, category:existing?.category || "Community & Recognition", summary:"", isNewUpdate:issued === "Nov 2026", verificationNote:note || "Listed in the supplied LinkedIn PDF; not independently verified.", sortOrder:index+1 };
});
const data: PortfolioPayload = {
  profile: VERIFIED_PROFILE,
  projects: [
    ...VERIFIED_PROJECTS.filter(p => p.id !== "mi4-systems").map(p => ({...p, lesson: p.id === "readytensor-rag" ? "Retrieval and grounding are central questions in this project." : p.id === "voilaa" ? "An experiment in making video-based learning interactive." : "Explore how AI system stability can be measured."})),
    {id:"banturakyat",code:"SYS-04",title:"BantuRakyat-AI",subtitle:"Discovering assistance programmes in Malaysia",period:"Ongoing",domain:"AI for public access",description:"A project to help Malaysians discover government assistance programmes and understand eligibility.",lesson:"Explore how technology can make public information easier to navigate.",stack:["AI for good","Malaysia"],repoUrl:"https://github.com/strdst7/BantuRakyat-AI",publicationUrl:"https://bantu-rakyat-ai.vercel.app/"}
  ],
  writing: VERIFIED_WRITING,
  audit: [
    {item:"50 LinkedIn-listed entries",status:"Listed, not all independently verified",source:"Supplied LinkedIn PDF, July 2025 to November 2026.",actionNeeded:"Add individual verification links where available."},
    {item:"Oracle Agentic AI Certified Foundations Associate",status:"Credly item marked unverified",source:"Public Credly wallet",actionNeeded:"Confirm directly with the issuer."},
    {item:"Google Advanced Data Analytics",status:"Potential duplicate",source:"Two related entries in LinkedIn PDF",actionNeeded:"Confirm whether these describe the same qualification."},
    {item:"Create Your First Gemini Enterprise Application",status:"Dates differ",source:"LinkedIn lists March 2026; Credly lists April 10, 2026.",actionNeeded:"Confirm which date should be used."}
  ],
  modules: MODULES.map((m,i)=>({...m,id:i+1,status: "Learning loop",summary: `An area to explore in the self-learning path: ${m.title.toLowerCase()}.`,deliverableTitle:"IDEA TO EXPLORE",deliverableDesc:"Try a small practical exercise, note what worked, and revisit the foundations as needed."})),
  certifications: certs,
  resources: RESOURCES.map((r,i)=>({...r,id:i+1,whyItWorked: r.title + " — an accessible starting point to explore.",createdAt:undefined})),
  fieldNotes: [
    { id:1, slug:"tinytoolcaller-tests", dateLabel:"Aug 2026 · TinyToolCaller", tag:"What Worked",title:"Testing caught a real bug",context:"The TinyToolCaller publication documents a small function-calling experiment.",whatHappened:"Its CPU tests caught a bug and helped guard against code–publication drift.",takeaway:"Testing is useful insurance, even for small experiments.",resonatesCount:0,sortOrder:1 },
    { id:2, slug:"tinytoolcaller-limits",dateLabel:"Aug 2026 · TinyToolCaller", tag:"What Didn't",title:"A result needs a clear limitation",context:"The publication notes that its reported results are in-sample.",whatHappened:"The evaluation does not provide an independent held-out estimate of generalization.",takeaway:"A convincing result is only as useful as a clear account of what it does not prove.",resonatesCount:0,sortOrder:2 },
    { id:3, slug:"ai-os-stability",dateLabel:"Mar 2026 · AI-OS",tag:"Lesson Learned",title:"A green dashboard is not the whole story",context:"AI-OS explores the stability of deployed AI systems.",whatHappened:"Infrastructure health alone cannot capture every change in model behavior.",takeaway:"Pay attention to stability as well as availability.",resonatesCount:0,sortOrder:3 }
  ],
  guestbook: []
};
export default function HomePage(){ return <MiiiExperience initialData={data} />; }

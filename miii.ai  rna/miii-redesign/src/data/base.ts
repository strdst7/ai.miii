export const VERIFIED_PROFILE = {
  brand: "miii.ai",
  previousInspiration: "miaws.com",
  fullName: "Nur Amirah Mohd Kamil",
  preferredName: "Mia",
  roleTitle: "AI Systems Engineer & Founder",
  company: "MI4 Inc.",
  companyUrl: "https://www.mi4inc.co",
  location: "Greater Kuala Lumpur, Malaysia",
  positioning:
    "I am building my own self-learning path, jumping between fundamentals, software development, AI engineering, and actually building things.",
  guidingPrinciple:
    "Stability is the discipline of not trusting your own output.",
  bioShort:
    "Nine years of flying the world with Qatar Airways (1,500+ flights across 85+ countries) taught me how complex systems hold—and how they fail under pressure. After transitioning through executive business leadership, I taught myself software development and AI engineering to build production systems that remain useful long after the demo.",
  links: {
    linkedin: "https://www.linkedin.com/in/nur-amirah-mohd-kamil-/",
    readyTensor: "https://app.readytensor.ai/users/nuramirahmohdkamil",
    readyTensorAlt: "https://app.readytensor.ai/users/nuramirahmohdkamil",
    credly: "https://www.credly.com/users/nur-amirah-mohd-kamil/badges",
    github: "https://github.com/strdst7/strdst7",
    devto: "https://dev.to/miii",
    existingPortfolio: "https://aimirah.com",
  },
  stats: [
    { value: "1,500+", label: "Flights flown", note: "Qatar Airways · 9+ years" },
    { value: "85+", label: "Countries", note: "Global operational perspective" },
    { value: "50", label: "Learning entries", note: "LinkedIn-listed credentials" },
    { value: "98/100", label: "AI Readiness", note: "Level 6 · AI Visionary" },
  ],
};

export const VERIFIED_PROJECTS = [
  {
    id: "ai-os",
    code: "SYS-01",
    title: "AI-OS",
    subtitle: "Stability-Centric Supervisory Architecture for Enterprise AI",
    period: "Mar 2026",
    domain: "AI Reliability & Control Systems",
    description:
      "Formalizes enterprise AI deployment stability as a measurable systems property. Instead of tracking isolated latency or token metrics, AI-OS models system survivability through the AI Deployment Stability Index (ADSI)—a composite metric integrating alignment, infrastructure health, and drift signals.",
    lesson:
      "AI systems fail quietly while traditional dashboards stay green. Monitoring survivability matters more than vanity accuracy.",
    stack: ["Python", "FastAPI", "Control Theory", "CI/CD", "Drift Detection"],
    repoUrl: "https://github.com/strdst7/ai-os",
    publicationUrl:
      "https://app.readytensor.ai/publications/ai-os-a-stability-centric-supervisory-architecture-for-enterprise-ai-deployment-esFyaOqeSQrq",
  },
  {
    id: "readytensor-rag",
    code: "SYS-02",
    title: "ReadyTensor RAG Assistant",
    subtitle: "Context-Aware Research Discovery & Retrieval Engine",
    period: "Nov 2025 – Present",
    domain: "Retrieval-Augmented Generation",
    description:
      "An AI-powered Retrieval-Augmented Generation assistant built with FastAPI, LangChain, ChromaDB, OpenAI, and Streamlit—enabling grounded, real-time semantic querying across Ready Tensor technical publications.",
    lesson:
      "Retrieval quality determines reasoning quality. Chunking strategy and citation grounding beat prompt complexity every time.",
    stack: ["FastAPI", "LangChain", "ChromaDB", "OpenAI", "Streamlit"],
    repoUrl: "https://github.com/strdst7/readytensor-rag-assistant",
    publicationUrl: "https://app.readytensor.ai/users/nuramirahmohdkamil",
  },
  {
    id: "voilaa",
    code: "SYS-03",
    title: "VOILAA",
    subtitle: "Interactive Video-to-Lesson Learning App",
    period: "2025",
    domain: "Applied Multimodal AI & EdTech",
    description:
      "Turns any YouTube video into a structured, active-recall learning session powered by Google Gemini—generating concise takeaways, concept breakdowns, and interactive quizzes so passive watching becomes verifiable comprehension.",
    lesson:
      "Built out of personal necessity while self-studying technical talks: passive video consumption creates the illusion of competence unless paired with active testing.",
    stack: ["Google Gemini", "Python", "Structured Outputs", "Web App"],
    repoUrl: "https://dev.to/miii/voilaa-turning-any-youtube-video-into-an-interactive-learning-app-with-google-gemini-2kl5",
    publicationUrl:
      "https://dev.to/miii/voilaa-turning-any-youtube-video-into-an-interactive-learning-app-with-google-gemini-2kl5",
  },
  {
    id: "mi4-systems",
    code: "SYS-04",
    title: "MI4 Inc. Modular AI Workflows",
    subtitle: "Workflow Automation, Data Integrity & Human-Centered Interfaces",
    period: "Ongoing",
    domain: "Enterprise AI Studio",
    description:
      "At MI4 Inc. (Kuala Lumpur), designing modular AI systems that bridge product strategy with production engineering—focusing on governance layers, workflow automation, and resilient human-in-the-loop operations.",
    lesson:
      "Intelligence should be engineered as a dependable system—not bolted on as a decorative chatbot.",
    stack: ["Python", "Docker", "Kubernetes", "SQL", "Agent Orchestration"],
    repoUrl: "https://github.com/strdst7/strdst7",
    publicationUrl: "https://aimirah.com",
  },
];

export const VERIFIED_WRITING = [
  {
    platform: "dev.to",
    title: "Turning any YouTube video into an interactive lesson",
    blurb:
      "How I built VOILAA with Google Gemini — paste a link, get structured summaries and quizzes you can actually learn from.",
    url: "https://dev.to/miii/voilaa-turning-any-youtube-video-into-an-interactive-learning-app-with-google-gemini-2kl5",
  },
  {
    platform: "LinkedIn",
    title: "What I learned building AI agents for real users",
    blurb:
      "The honest gap between a weekend demo that impresses on social media and a system that survives Monday morning.",
    url: "https://www.linkedin.com/pulse/what-i-learned-building-agentic-ai-production-nur-amirah-mohd-kamil-y23jc/",
  },
  {
    platform: "LinkedIn",
    title: "From the skies to the C-suite: How Global Experience Shaped My Leadership Style",
    blurb:
      "What years of international aviation with Qatar Airways taught me about calm execution, checklists, and leading teams.",
    url: "https://www.linkedin.com/pulse/from-skies-c-suite-how-global-experience-shaped-my-style-mohd-kamil-ekp0c/",
  },
];

export const VERIFICATION_AUDIT = [
  {
    item: "50 credentials from the LinkedIn list supplied by Mia (Jul 2025 – Nov 2026)",
    status: "Added exactly as supplied",
    source: "Titles, issuers, months and expiry dates transcribed from the list provided in the brief. Not independently re-checked against each issuer.",
    actionNeeded: "Share direct credential / Credly / Coursera URLs. Until then every entry links to a public profile page, not the individual certificate.",
  },
  {
    item: "Latest: Data Science and AI For Decision Making (Harvard Business School Online) and Claude Academy: Claude 101 (Anthropic), Nov 2026",
    status: "Marked as Latest",
    source: "Supplied list, November 2026",
    actionNeeded: "Attach the verification links for these two first.",
  },
  {
    item: "Expiring credentials: AI Leadership (OpenAI, Apr 2027), Oracle Agentic AI Certified Foundations Associate (Oct 2028), Gemini Certified Educator (Jan 2029)",
    status: "Expiry dates shown on cards",
    source: "Supplied list",
    actionNeeded: "None until closer to expiry.",
  },
  {
    item: "Agentic AI Developer Certification (Ready Tensor)",
    status: "Kept from earlier LinkedIn post",
    source: "A LinkedIn post announcing completion; the date needs verification. Not present in the latest list.",
    actionNeeded: "Confirm whether this is the same credential as RAG Systems Expert (Feb 2026); remove the duplicate if so.",
  },
  {
    item: "AI Visionary (98/100, Level 6, #001507) and KrackedDevs Top 5 & Bounty Winner",
    status: "Kept from aimirah.com, undated",
    source: "Listed on aimirah.com. Not in the latest LinkedIn list; no issue dates or public verification links found.",
    actionNeeded: "Provide dates and verification links, or confirm they should be removed.",
  },
  {
    item: "Doctorate in Progress & UiTM Diploma",
    status: "Not displayed",
    source: "Listed on aimirah.com ('Doctorate in progress', 'Diploma, UiTM'). No institution, programme or dates available.",
    actionNeeded: "Provide institution and programme if you want these shown.",
  },
];


export const MODULES = [
          {
            code: "M00",
            phase: "01 · Orientation",
            title: "First Principles & Problem Framing",
            tagline: "Start with a real problem, never with a framework.",
            summary:
              "Instead of following a rigid syllabus, every learning sprint begins with a concrete friction point: a workflow bottleneck, a broken retrieval step, or a tool I wish existed.",
            deliverableTitle: "PROBLEM-FIRST LEARNING BRIEF",
            deliverableDesc:
              "Define the exact failure mode to solve, what 'working on Monday morning' looks like, and which fundamentals are missing.",
            tools: ["Markdown Specs", "System Diagrams", "Git"],
            status: "Continuous",
            sortOrder: 0,
          },
          {
            code: "M01",
            phase: "02 · Fundamentals",
            title: "Python, Data Structures & Clean Logic",
            tagline: "No flashy demos here—this is where compound interest starts.",
            summary:
              "Jumping back into core Python, typing, async I/O, APIs, and data structures whenever high-level abstractions hide what is actually happening underneath.",
            deliverableTitle: "REPRODUCIBLE PYTHON FOUNDATION",
            deliverableDesc:
              "Clean, modular Python scripts, Pydantic schemas, and testable CLI/API utilities without notebook spaghetti.",
            tools: ["Python", "Pydantic", "AsyncIO", "Pytest"],
            status: "Shipped",
            sortOrder: 1,
          },
          {
            code: "M02",
            phase: "03 · Software Dev",
            title: "Backend APIs, Databases & Fullstack Shipping",
            tagline: "An AI model without software around it is just a prompt.",
            summary:
              "Building real services around intelligence: FastAPI endpoints, PostgreSQL/SQL schemas, authentication, error handling, and clean frontends people can actually use.",
            deliverableTitle: "PRODUCTION SERVICE BACKBONE",
            deliverableDesc:
              "Typed REST APIs, relational persistence, and interactive web interfaces deployed end-to-end.",
            tools: ["FastAPI", "PostgreSQL", "SQL", "Next.js", "Streamlit"],
            status: "Shipped",
            sortOrder: 2,
          },
          {
            code: "M03",
            phase: "04 · Data & Analytics",
            title: "Data Modeling, BigQuery & ML Foundations",
            tagline: "Models are only as honest as the data pipelines feeding them.",
            summary:
              "Completed Google Advanced Data Analytics and Google Cloud BigQuery ML training to ground generative AI intuition in statistical rigor and warehouse-scale ML.",
            deliverableTitle: "BIGQUERY ML & ANALYTICS PIPELINES",
            deliverableDesc:
              "Feature engineering, SQL-native ML models in BigQuery, and verifiable data validation workflows.",
            tools: ["BigQuery ML", "SQL", "Pandas", "Scikit-learn"],
            status: "Shipped",
            sortOrder: 3,
          },
          {
            code: "M04",
            phase: "05 · Retrieval Systems",
            title: "Embeddings, Vector Stores & Grounded RAG",
            tagline: "How retrieval shapes reasoning—and where naive RAG breaks.",
            summary:
              "Built the ReadyTensor RAG Assistant to test chunking strategies, semantic search, ChromaDB indexing, and source-grounded answers on real technical papers.",
            deliverableTitle: "READYTENSOR RAG ASSISTANT",
            deliverableDesc:
              "Context-aware publication search engine built with FastAPI, LangChain, ChromaDB, and Streamlit.",
            tools: ["LangChain", "ChromaDB", "OpenAI Embeddings", "FastAPI"],
            status: "Shipped",
            sortOrder: 4,
          },
          {
            code: "M05",
            phase: "06 · Agentic Engineering",
            title: "Tool Use, Multi-Step Reasoning & Agent Loops",
            tagline: "Structuring intelligence instead of improvising prompts.",
            summary:
              "Earned Ready Tensor's Agentic AI Developer & Agentic AI Engineer certifications by architecting bounded agent loops with deterministic tool interfaces and guardrails.",
            deliverableTitle: "BOUNDED AGENTIC WORKFLOWS",
            deliverableDesc:
              "Multi-step tool-calling agents with explicit state transitions, fallback paths, and human approval gates.",
            tools: ["Agentic Patterns", "Tool Calling", "LangGraph", "Gemini"],
            status: "Shipped",
            sortOrder: 5,
          },
          {
            code: "M06",
            phase: "07 · Cloud & Infra",
            title: "Containers, Kubernetes & Cloud Architecture",
            tagline: "Making systems portable, observable, and reproducible.",
            summary:
              "Earned Google Cloud's Cloud Architecture: Design, Implement, and Manage skill badge while containerizing AI backends with Docker and Kubernetes.",
            deliverableTitle: "CLOUD-READY DEPLOYMENT TOPOLOGY",
            deliverableDesc:
              "Containerized services, environment isolation, CI/CD pipelines, and cloud infrastructure blueprints.",
            tools: ["Google Cloud", "Docker", "Kubernetes", "CI/CD"],
            status: "Shipped",
            sortOrder: 6,
          },
          {
            code: "M07",
            phase: "08 · Reliability & Eval",
            title: "Drift Detection, Guardrails & Survivability",
            tagline: "What if the system looks 'green'—but is already unstable?",
            summary:
              "Designed AI-OS and the AI Deployment Stability Index (ADSI) to measure alignment, infrastructure health, and behavioral drift before silent failures reach users.",
            deliverableTitle: "AI-OS SUPERVISORY ARCHITECTURE",
            deliverableDesc:
              "Composite survivability scoring (ADSI) combining control-systems thinking with continuous evaluation.",
            tools: ["AI-OS", "Control Systems", "Evals", "Observability"],
            status: "Active Loop",
            sortOrder: 7,
          },
          {
            code: "M08",
            phase: "09 · Human-Centered UI",
            title: "Interfaces That Earn Trust",
            tagline: "Clarity over AI magic tricks.",
            summary:
              "Designing interfaces—like VOILAA and MI4 Inc. workspaces—where users can inspect sources, verify confidence, and steer the system without friction.",
            deliverableTitle: "INTERACTIVE AI INTERFACES",
            deliverableDesc:
              "Streaming responses, transparent citations, and tactile editorial/canvas workspaces.",
            tools: ["React", "TypeScript", "Tailwind CSS", "UX Systems"],
            status: "Active Loop",
            sortOrder: 8,
          },
          {
            code: "M09",
            phase: "10 · Synthesis",
            title: "Build in Public & Compound the Loop",
            tagline: "Ship, document what broke, refine the roadmap, repeat.",
            summary:
              "Every build turns into an open-source repo, a technical publication on Ready Tensor, or an honest field note—feeding the next cycle of fundamentals and engineering.",
            deliverableTitle: "MIII.AI LIVING KNOWLEDGE SYSTEM",
            deliverableDesc:
              "An evolving public record of roadmaps, free resources, verified credentials, and shipped systems.",
            tools: ["Open Source", "Technical Writing", "MI4 Inc."],
            status: "Continuous",
            sortOrder: 9,
          },
        ];
export const RESOURCES = [
          {
            slug: "ready-tensor-agentic-programs",
            title: "Ready Tensor Agentic AI Certification Programs",
            provider: "Ready Tensor, Inc.",
            category: "AI Engineering",
            costType: "Free",
            url: "https://www.readytensor.ai/",
            whyItWorked:
              "Project-reviewed instead of multiple-choice. You only pass when you ship a working, documented system and publish your architecture.",
            recommendedByVisitor: false,
          },
          {
            slug: "google-cloud-skills-boost",
            title: "Google Cloud Skills Boost (BigQuery ML & Architecture Labs)",
            provider: "Google Cloud",
            category: "Cloud & Data",
            costType: "Free Tier / Open",
            url: "https://www.skills.google/",
            whyItWorked:
              "Real sandboxed cloud environments where you configure IAM, VPCs, and BigQuery ML models directly rather than watching passive slides.",
            recommendedByVisitor: false,
          },
          {
            slug: "fast-ai-practical-dl",
            title: "Practical Deep Learning for Coders",
            provider: "fast.ai",
            category: "Fundamentals",
            costType: "Free",
            url: "https://course.fast.ai/",
            whyItWorked:
              "Top-down learning philosophy: get a working model running first, then peel back the math and PyTorch internals layer by layer.",
            recommendedByVisitor: false,
          },
          {
            slug: "fullstack-open-helsinki",
            title: "Full Stack Open — Modern Web Development",
            provider: "University of Helsinki",
            category: "Software Dev",
            costType: "Free",
            url: "https://fullstackopen.com/en/",
            whyItWorked:
              "Bridges the gap between writing Python scripts and building real TypeScript, React, API, and container-backed applications.",
            recommendedByVisitor: false,
          },
          {
            slug: "anthropic-prompt-engineering-docs",
            title: "Anthropic Prompt Engineering & Tool Use Documentation",
            provider: "Anthropic",
            category: "AI Engineering",
            costType: "Free",
            url: "https://docs.anthropic.com/",
            whyItWorked:
              "Clear mental models on structured outputs, context boundaries, evaluation harnesses, and why simpler agent loops outperform tangled graphs.",
            recommendedByVisitor: false,
          },
          {
            slug: "cs50-python-harvard",
            title: "CS50's Introduction to Programming with Python",
            provider: "Harvard OpenCourseWare",
            category: "Fundamentals",
            costType: "Free",
            url: "https://cs50.harvard.edu/python/",
            whyItWorked:
              "Sharpens core habits—exceptions, file I/O, unit testing, and object-oriented structure—so you never rely blindly on autocomplete.",
            recommendedByVisitor: false,
          },
        ];

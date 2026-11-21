import { NextResponse } from "next/server";
import { VERIFIED_PROFILE, VERIFIED_PROJECTS } from "@/db/seed";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function buildGroundedReply(userMessage: string): {
  reply: string;
  suggestedFollowUps: string[];
  highlightSection?: string;
} {
  const q = userMessage.toLowerCase();

  if (
    q.includes("cert") ||
    q.includes("badge") ||
    q.includes("ready tensor") ||
    q.includes("bigquery") ||
    q.includes("credential")
  ) {
    return {
      reply:
        "Mia's portfolio lists 50+ credentials from July 2025 to November 2026. The two most recent (Nov 2026):\n\n" +
        "• **Data Science and AI For Decision Making** — *Harvard Business School Online*\n" +
        "• **Claude Academy: Claude 101** — *Anthropic*\n\n" +
        "Highlights by theme:\n" +
        "• **AI & agents**: Ready Tensor *Agentic AI Builder* (May 2026), *Agentic AI Engineer* (Mar 2026) and *RAG Systems Expert* (Feb 2026); Oracle *Agentic AI Certified Foundations Associate* (expires Oct 2028); OpenAI *AI Leadership* (expires Apr 2027); a series of Anthropic *Claude Academy* courses (Oct 2026).\n" +
        "• **Software & web**: Harvard *CS50* and HarvardX *CS50W*, CodeSignal *Foundations of Software Development*, MongoDB *CRUD Operations*.\n" +
        "• **Data & cloud**: Google *Advanced Data Analytics* (May 2026), *BigQuery ML*, *Cloud Architecture* and *Secure Google Cloud Network* skill badges.\n\n" +
        "Most of these are free or short courses, so they show what Mia studied. Her shipped projects are the better test of what stuck. Direct credential links are still being collected.",
      suggestedFollowUps: [
        "Tell me about AI-OS and why she built it",
        "How does she decide what to learn next?",
        "What free courses does Mia recommend?",
      ],
      highlightSection: "credentials",
    };
  }

  if (
    q.includes("ai-os") ||
    q.includes("aios") ||
    q.includes("project") ||
    q.includes("build") ||
    q.includes("rag") ||
    q.includes("voilaa")
  ) {
    return {
      reply:
        "Mia treats learning as an engineering feedback loop—every concept has to turn into a shipped artifact:\n\n" +
        "1. **AI-OS** (*Mar 2026*): A stability-centric supervisory architecture introducing the **AI Deployment Stability Index (ADSI)**—combining alignment, infrastructure health, and drift signals so AI systems don't fail silently while dashboards stay green.\n" +
        "2. **ReadyTensor RAG Assistant** (*Nov 2025 – Present*): Built with FastAPI, LangChain, ChromaDB, OpenAI, and Streamlit for context-aware querying of Ready Tensor technical publications.\n" +
        "3. **VOILAA** (*2025*): Powered by Google Gemini to convert any YouTube video into structured lessons and active-recall quizzes.\n" +
        "4. **MI4 Inc. Systems**: Modular enterprise AI workflows focused on data integrity, governance, and reliability.",
      suggestedFollowUps: [
        "What went wrong in her early AI agent experiments?",
        "Show me her 10-stage self-learning roadmap",
        "How did aviation shape her engineering mindset?",
      ],
      highlightSection: "projects",
    };
  }

  if (
    q.includes("decide") ||
    q.includes("choose") ||
    q.includes("evaluate") ||
    q.includes("next") ||
    q.includes("roadmap") ||
    q.includes("path")
  ) {
    return {
      reply:
        `Mia's core positioning is straightforward: *"${VERIFIED_PROFILE.positioning}"*\n\n` +
        "Instead of chasing every new AI wrapper, she evaluates what to learn next through **four practical filters**:\n" +
        "1. **Friction Trigger**: Did a real build break because of a missing fundamental (e.g., async concurrency, SQL indexing, drift evaluation)?\n" +
        "2. **Compounding Shelf-Life**: Will this skill still matter two model generations from now (Python, data modeling, control theory, cloud architecture)?\n" +
        "3. **Artifact Test**: Can she ship a working repo, paper, or live app within 2–4 weeks to prove comprehension?\n" +
        "4. **Survivability Impact**: Does it make a system more dependable after Monday morning?",
      suggestedFollowUps: [
        "Which free courses helped her the most?",
        "What are her latest certifications?",
        "What lessons did she learn from failures?",
      ],
      highlightSection: "roadmap",
    };
  }

  if (
    q.includes("free") ||
    q.includes("course") ||
    q.includes("resource") ||
    q.includes("platform") ||
    q.includes("learn")
  ) {
    return {
      reply:
        "Mia prioritizes free, hands-on, project-reviewed learning platforms over passive video playlists:\n\n" +
        "• **Ready Tensor** — Free, project-reviewed Agentic AI programs where you must publish real code and architecture to earn certification.\n" +
        "• **Google Cloud Skills Boost** — Hands-on cloud & BigQuery ML sandbox labs.\n" +
        "• **fast.ai (Practical Deep Learning for Coders)** — Top-down learning: build first, then peel back the math.\n" +
        "• **University of Helsinki — Full Stack Open** — Modern TypeScript, React, API, and container engineering.\n" +
        "• **Harvard CS50 Python & Anthropic Docs** — Clean Python habits, tool use, and evaluation design.",
      suggestedFollowUps: [
        "How does she balance fundamentals vs building?",
        "Show me her verified credentials",
        "Tell me about her aviation-to-AI story",
      ],
      highlightSection: "resources",
    };
  }

  if (
    q.includes("qatar") ||
    q.includes("aviation") ||
    q.includes("flight") ||
    q.includes("who") ||
    q.includes("mia") ||
    q.includes("amirah") ||
    q.includes("story")
  ) {
    return {
      reply:
        `**Nur Amirah Mohd Kamil (Mia)** is an AI Systems Engineer and Founder & CEO of **MI4 Inc.**, based in Greater Kuala Lumpur, Malaysia.\n\n` +
        "Before building AI systems, she spent **9+ years flying internationally with Qatar Airways** (1,500+ flights across 85+ countries) and served in executive business leadership. Aviation taught her a core engineering truth: *complex systems fail at the seams, and checklists exist because human memory isn't a safety architecture.*\n\n" +
        `Her guiding rule on **miii.ai**: *"${VERIFIED_PROFILE.guidingPrinciple}"*`,
      suggestedFollowUps: [
        "What certifications has she earned recently?",
        "What projects has she shipped?",
        "How does she decide what to learn next?",
      ],
      highlightSection: "story",
    };
  }

  return {
    reply:
      `Welcome to **miii.ai** — Nur Amirah Mohd Kamil's (Mia) living self-learning lab.\n\n` +
      `Her approach: *"${VERIFIED_PROFILE.positioning}"*\n\n` +
      `You can ask me about her **10-stage learning roadmap (M00–M09)**, her **newly verified Ready Tensor & Google Cloud certifications**, shipped systems like **${VERIFIED_PROJECTS.map((p) => p.title).join(", ")}**, her **free resource stack**, or honest field notes on what worked and what broke.`,
    suggestedFollowUps: [
      "Show me Mia's latest certifications",
      "How does Mia decide what to learn next?",
      "What projects has Mia built?",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatTurn[] = Array.isArray(body.messages) ? body.messages : [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const query = lastUser?.content?.trim() || "Tell me about Mia's journey";

    // Optional live LLM enhancement if an API key is configured in environment
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-latest",
            max_tokens: 450,
            system:
              "You are miii.ai, the personal AI guide for Nur Amirah Mohd Kamil (Mia), AI Systems Engineer & Founder & CEO of MI4 Inc. in Kuala Lumpur, Malaysia. " +
              "Core positioning: 'I am building my own self-learning path, jumping between fundamentals, software development, AI engineering, and actually building things.' " +
              "Guiding principle: 'Stability is the discipline of not trusting your own output.' " +
              "Verified facts ONLY: Former Qatar Airways cabin crew (1,500+ flights, 85+ countries) and executive business leader before self-teaching software & AI engineering. " +
              "Credentials (from Mia's LinkedIn list, Jul 2025 - Nov 2026; most are free or short courses): latest are Data Science and AI For Decision Making (Harvard Business School Online) and Claude Academy: Claude 101 (Anthropic), Nov 2026; Ready Tensor Agentic AI Builder (May 2026), Agentic AI Engineer (Mar 2026), RAG Systems Expert (Feb 2026); Oracle Agentic AI Certified Foundations Associate; OpenAI AI Leadership; Harvard CS50 and CS50W; Google Advanced Data Analytics and Google Cloud skill badges (BigQuery ML, Cloud Architecture, Secure Network). Also listed on aimirah.com but undated: Ministry of Digital AI Visionary (98/100) and KrackedDevs Top 5. " +
              "Verified projects: AI-OS (ADSI supervisory architecture, FastAPI), ReadyTensor RAG Assistant (FastAPI, LangChain, ChromaDB, OpenAI, Streamlit), VOILAA (YouTube-to-lesson app with Google Gemini), MI4 Inc. modular enterprise AI workflows. " +
              "Never invent unverified credentials. Keep answers concise, candid, warm, and structured with bullet points.",
            messages: messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.content?.[0]?.text;
          if (typeof text === "string" && text.trim()) {
            const fallback = buildGroundedReply(query);
            return NextResponse.json({
              reply: text.trim(),
              suggestedFollowUps: fallback.suggestedFollowUps,
              highlightSection: fallback.highlightSection,
              mode: "live-claude",
            });
          }
        }
      } catch {
        // Fall through cleanly to deterministic grounded engine
      }
    }

    const result = buildGroundedReply(query);
    return NextResponse.json({
      ...result,
      mode: "grounded-knowledge",
    });
  } catch (error) {
    console.error("[miii.ai] Chat route error:", error);
    return NextResponse.json(
      { error: "The miii.ai assistant hit a temporary snag. Please try again." },
      { status: 500 }
    );
  }
}

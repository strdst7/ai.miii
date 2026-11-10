"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  Flame,
  Layers,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Terminal,
  X,
  Plane,
  Briefcase,
  Code2,
  Building2,
} from "lucide-react";
import type {
  PortfolioPayload,
  ChatMessage,
  LearningResourceItem,
  FieldNoteItem,
  GuestbookEntry,
} from "@/types/portfolio";
import { MiiiMarkdown } from "./MiiiMarkdown";
import { AiCanvasWorkspace } from "./AiCanvasWorkspace";
import { CommandKey3D } from "./CommandKey3D";

function Github({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-1.9c-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.49-.28-5.11-1.24-5.11-5.53 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.43.11-2.97 0 0 .94-.3 3.08 1.15a10.72 10.72 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.69.11 2.97.72.78 1.15 1.78 1.15 3.01 0 4.3-2.63 5.24-5.13 5.52.4.35.76 1.03.76 2.07v2.89c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg> };

type SceneId = "top" | "roadmap" | "projects" | "credentials" | "resources" | "notes" | "decision" | "story" | "canvas";
const SCENES: Array<{id: SceneId; label: string; index: string; tint: string}> = [
  {id:"top",label:"The beginning",index:"00",tint:"#d4c8f0"},
  {id:"roadmap",label:"Learning roadmap",index:"01",tint:"#d6bcec"},
  {id:"projects",label:"The workbench",index:"02",tint:"#c8bde8"},
  {id:"credentials",label:"Learning milestones",index:"03",tint:"#e6c3df"},
  {id:"resources",label:"The toolkit",index:"04",tint:"#d2d5ed"},
  {id:"notes",label:"Field notes",index:"05",tint:"#e4c3dc"},
  {id:"decision",label:"What comes next",index:"06",tint:"#ebd8ad"},
  {id:"story",label:"The journey",index:"07",tint:"#cbbfe5"},
  {id:"canvas",label:"The canvas",index:"08",tint:"#d1c2ef"},
];
function ChapterNavigation({current, onNavigate}: {current: SceneId; onNavigate: (id: SceneId) => void}) {
  const index = SCENES.findIndex(scene => scene.id === current);
  const previous = SCENES[index - 1];
  const next = index === 7 ? SCENES[0] : SCENES[index + 1];
  return <nav className="chapter-navigation" aria-label={`Navigate from ${SCENES[index].label}`}>
    {previous && <button type="button" className="chapter-link chapter-link-prev" onClick={() => onNavigate(previous.id)}><span className="chapter-overline">Previous chapter <span>{previous.index}</span></span><span className="chapter-name">{previous.label}</span></button>}
    {next && <button type="button" className="chapter-link chapter-link-next" onClick={() => onNavigate(next.id)}><span className="chapter-overline">{index === 7 ? "Return to" : "Next chapter"} <span>{next.index}</span></span><span className="chapter-name">{next.label}</span></button>}
  </nav>;
}

// Single fixed atmosphere: "Violet Sun".
const ATMOSPHERE = {
  base: "#d4c8f0",
  c1: "#c8b4f0",
  c2: "#f5e090",
  c3: "#f7e89c",
  c4: "#d4bcf6",
};

const DECISION_PRESETS = [
  {
    label: "Building an MCP tool server for local workflows",
    friction: 5,
    shelfLife: 4,
    artifact: 5,
    survivability: 5,
    note: "Solves immediate tool-orchestration friction and ships as a working server within a weekend.",
  },
  {
    label: "Chasing every new AI wrapper framework this week",
    friction: 1,
    shelfLife: 1,
    artifact: 2,
    survivability: 1,
    note: "High churn, low compounding value. Skip unless a concrete production bottleneck demands it.",
  },
  {
    label: "Control theory & drift metrics for AI-OS",
    friction: 5,
    shelfLife: 5,
    artifact: 5,
    survivability: 5,
    note: "Directly solves silent production degradation and compounds across every future AI system.",
  },
  {
    label: "Custom fine-tuning before testing retrieval & evals",
    friction: 2,
    shelfLife: 3,
    artifact: 3,
    survivability: 2,
    note: "Defer until clean RAG + evaluation baselines prove prompt/retrieval limits.",
  },
];

export function MiiiExperience({
  initialData,
}: {
  initialData: PortfolioPayload;
}) {
  const [viewMode, setViewMode] = useState<"home" | "canvas">("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Interactive state for this browser session
  const [resources, setResources] = useState<LearningResourceItem[]>(
    initialData.resources
  );
  const [fieldNotes, setFieldNotes] = useState<FieldNoteItem[]>(
    initialData.fieldNotes
  );
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(
    initialData.guestbook
  );
  const [resonatedIds, setResonatedIds] = useState<number[]>([]);

  // Filters
  const [roadmapFilter, setRoadmapFilter] = useState<string>("All");
  const [expandedModule, setExpandedModule] = useState<string>("M07");
  const [certFilter, setCertFilter] = useState<string>("All");
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [resourceFilter, setResourceFilter] = useState<string>("All");
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  // Resource submission form
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resTitle, setResTitle] = useState("");
  const [resProvider, setResProvider] = useState("");
  const [resCategory, setResCategory] = useState("AI Engineering");
  const [resUrl, setResUrl] = useState("");
  const [resWhy, setResWhy] = useState("");
  const [resSubmitting, setResSubmitting] = useState(false);
  const [resFeedback, setResFeedback] = useState<string | null>(null);

  // Guestbook form
  const [gbName, setGbName] = useState("");
  const [gbRole, setGbRole] = useState("");
  const [gbTopic, setGbTopic] = useState("Self-Learning & AI");
  const [gbMessage, setGbMessage] = useState("");
  const [gbSubmitting, setGbSubmitting] = useState(false);
  const [gbFeedback, setGbFeedback] = useState<string | null>(null);

  // Interactive Decision Matrix
  const [evalTopic, setEvalTopic] = useState(DECISION_PRESETS[0].label);
  const [frictionScore, setFrictionScore] = useState(DECISION_PRESETS[0].friction);
  const [shelfLifeScore, setShelfLifeScore] = useState(DECISION_PRESETS[0].shelfLife);
  const [artifactScore, setArtifactScore] = useState(DECISION_PRESETS[0].artifact);
  const [survivabilityScore, setSurvivabilityScore] = useState(
    DECISION_PRESETS[0].survivability
  );

  // Conversational Agent state (shared between Home drawer & Canvas)
  const [heroPrompt, setHeroPrompt] = useState("");
  const [drawerInput, setDrawerInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — I’m the **miii.ai** guide for **Nur Amirah Mohd Kamil (Mia)**.\n\n" +
        "This is a simple local guide, not a live AI service. Mia is building her own non-linear self-learning path across **fundamentals, software development, AI engineering, and building things**.\n\n" +
        "Ask me about her **LinkedIn-listed certifications**, her **10-stage learning roadmap (M00–M09)**, shipped systems like **AI-OS** and **VOILAA**, or how she decides what to learn next.",
      suggestedFollowUps: [
        "What are Mia's latest LinkedIn-listed credentials?",
        "How does Mia decide what to learn next?",
        "Tell me about AI-OS and her projects",
        "Recommend free AI & coding resources",
      ],
    },
  ]);

  const drawerEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (drawerOpen) {
      drawerEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, drawerOpen, isSending]);


  async function sendChatMessage(text: string, openDrawerIfHome = true) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setIsSending(true);
    if (viewMode === "home" && openDrawerIfHome) {
      setDrawerOpen(true);
    }

    const q = trimmed.toLowerCase();
    let reply = "This is a simple local guide, not a live AI assistant. Explore the roadmap, projects, credentials, and resources below, or ask about one of those topics.";
    if (/cert|badge|credential/.test(q)) reply = "The most recent entries in the supplied LinkedIn PDF are **Data Science and AI For Decision Making** from Harvard Business School Online and **Claude Academy: Claude 101** from Anthropic, both listed in November 2026. They have not been independently verified here. Explore the credentials section for the full list and direct links where available.";
    else if (/resource|course|learn.*free/.test(q)) reply = "The resource library has starting points for programming, AI, cloud and data. Some platforms offer paid features; resources are suggestions, not claims that Mia completed each one.";
    else if (/project|ai-os|build/.test(q)) reply = "Explore **AI-OS**, the **Ready Tensor RAG Assistant**, **VOILAA**, and **BantuRakyat-AI** in the projects section. Their links lead to the project repositories or published write-ups.";
    else if (/roadmap|learn|next|decid/.test(q)) reply = "Mia’s learning path moves between fundamentals, development, AI engineering and building. The roadmap is a flexible map, not a claim that every stage is complete. The decision matrix is an illustrative tool for prioritising a next step.";
    const highlightSection = /cert|badge|credential/.test(q) ? "credentials" : /resource|course|learn.*free/.test(q) ? "resources" : /project|ai-os|build/.test(q) ? "projects" : /roadmap|learn|next|decid/.test(q) ? "roadmap" : undefined;
    setMessages(prev => [...prev, {id:`a-${Date.now()}`, role:"assistant",content:reply,highlightSection}]);
    setIsSending(false);
  }

  const [scene, setScene] = useState<{ phase: "cover" | "reveal"; target: SceneId; direction: "forward" | "backward" } | null>(null);
  const transitionBusy = useRef(false);
  const timers = useRef<number[]>([]);
  const navigateRef = useRef<(id: SceneId, writeHistory?: boolean) => void>(() => {});
  const pendingHistory = useRef<SceneId | null>(null);
  const motionCleanup = useRef<(() => void) | null>(null);
  const onSceneAnimationEnd = useRef<(phase: "cover" | "reveal") => void>(() => {});

  function navigateTo(target: SceneId, writeHistory = true) {
    if (transitionBusy.current) {
      if (!writeHistory) pendingHistory.current = target;
      return;
    }
    const nextScene = SCENES.find(item => item.id === target);
    if (!nextScene) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentIndex = viewMode === "canvas" ? 8 : (() => {
      let current = 0;
      SCENES.slice(1, 8).forEach((item, i) => {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= 160) current = i + 1;
      });
      return current;
    })();
    const targetIndex = SCENES.findIndex(item => item.id === target);
    const direction = targetIndex >= currentIndex ? "forward" : "backward";
    const currentSection = viewMode === "canvas" ? null : (SCENES.slice(1, 8).map(item => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el)).reverse().find(el => el.getBoundingClientRect().top <= 160) || null);
    // Animate only a small visible header, not the entire long document or grid.
    const outgoing = viewMode === "canvas" ? document.querySelector<HTMLElement>(".canvas-chat") : currentSection?.querySelector<HTMLElement>(":scope > div:first-child") || document.querySelector<HTMLElement>("#top > section:first-child");
    setDrawerOpen(false);
    const originalOverflow = document.body.style.overflow;
    const originalBehavior = document.documentElement.style.scrollBehavior;
    const destination = () => {
      flushSync(() => setViewMode(target === "canvas" ? "canvas" : "home"));
      document.documentElement.style.scrollBehavior = "auto";
      const el = target === "canvas" ? null : document.getElementById(target);
      const top = el && target !== "top" ? Math.max(0, window.scrollY + el.getBoundingClientRect().top - 74) : 0;
      window.scrollTo({top, behavior:"instant"});
      if (writeHistory && window.location.hash !== `#${target}`) window.history.pushState({scene:target}, "", `#${target}`);
      return el;
    };
    if (reduced) {
      const el = destination();
      document.documentElement.style.scrollBehavior = originalBehavior;
      const heading = el?.querySelector<HTMLElement>("h1, h2");
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
      return;
    }
    transitionBusy.current = true;
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollBehavior = "auto";
    outgoing?.classList.add("scene-outgoing");
    setScene({phase:"cover",target,direction});
    let incoming: HTMLElement | null = null;
    motionCleanup.current = () => {
      outgoing?.classList.remove("scene-outgoing");
      incoming?.classList.remove("scene-incoming");
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.scrollBehavior = originalBehavior;
      transitionBusy.current = false;
    };
    let pauseTimer: number | undefined;
    const finish = () => {
      if (!transitionBusy.current) return;
      window.clearTimeout(safetyTimer);
      window.clearTimeout(pauseTimer);
      onSceneAnimationEnd.current = () => {};
      const heading = incoming?.querySelector<HTMLElement>("h1, h2");
      motionCleanup.current?.();
      motionCleanup.current = null;
      setScene(null);
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
      const queued = pendingHistory.current;
      pendingHistory.current = null;
      if (queued) window.setTimeout(() => navigateRef.current(queued, false), 0);
    };
    let covered = false;
    onSceneAnimationEnd.current = (phase) => {
      if (phase === "cover" && !covered) {
        covered = true;
        outgoing?.classList.remove("scene-outgoing");
        const destinationElement = destination();
        incoming = target === "top" ? destinationElement?.querySelector<HTMLElement>(":scope > section:first-child") ?? null : target === "canvas" ? document.querySelector<HTMLElement>(".canvas-chat") : destinationElement;
        // Hold the fully covered sheet briefly before revealing the next chapter.
        pauseTimer = window.setTimeout(() => {
          incoming?.classList.add("scene-incoming");
          setScene({phase:"reveal",target,direction});
        }, 600);
        timers.current.push(pauseTimer);
      } else if (phase === "reveal" && covered) {
        finish();
      }
    };
    // Safety net if animations are disabled or interrupted after navigation begins.
    const safetyTimer = window.setTimeout(() => {
      if (!transitionBusy.current) return;
      if (!covered) onSceneAnimationEnd.current("cover");
      finish();
    }, 3000);
    timers.current.push(safetyTimer);
  }
  navigateRef.current = navigateTo;
  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.slice(1);
      const target = SCENES.find(item => item.id === hash)?.id ?? "top";
      navigateRef.current(target, false);
    };
    const oldRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    // Restore a directly linked chapter without an entrance animation on first load.
    const initial = SCENES.find(item => item.id === window.location.hash.slice(1));
    if (initial?.id === "canvas") setViewMode("canvas");
    else if (initial && initial.id !== "top") requestAnimationFrame(() => {
      const target = document.getElementById(initial.id);
      if (target) window.scrollTo({top:Math.max(0, window.scrollY + target.getBoundingClientRect().top - 74),behavior:"instant"});
    });
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.history.scrollRestoration = oldRestoration;
      timers.current.forEach(window.clearTimeout);
      motionCleanup.current?.();
    };
  }, []);
  function jumpToSection(sectionId?: string) {
    const target = SCENES.find(item => item.id === sectionId)?.id ?? "top";
    navigateTo(target);
  }

  async function handleResourceSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = new URL(resUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      setResources(prev => [...prev, { id:Date.now(), slug:`session-${Date.now()}`, title:resTitle.trim(), provider:resProvider.trim(), category:resCategory, costType:"Not checked", url:url.href, whyItWorked:resWhy.trim(), recommendedByVisitor:true }]);
      setResTitle(""); setResProvider(""); setResUrl(""); setResWhy(""); setShowResourceForm(false);
      setResFeedback("Added for this browser session only; not published or saved.");
    } catch { setResFeedback("Please enter a valid http or https URL."); }
  }
  async function handleResonate(noteId: number) {
    if (resonatedIds.includes(noteId)) return;
    setResonatedIds(prev => [...prev, noteId]);
    setFieldNotes(prev => prev.map(n => n.id === noteId ? {...n, resonatesCount:n.resonatesCount+1} : n));
  }
  async function handleGuestbookSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) { setGbFeedback("Please enter a name and message."); return; }
    setGuestbook(prev => [{id:Date.now(), senderName:gbName.trim(), senderRole:gbRole.trim() || "Reader", topic:gbTopic, message:gbMessage.trim(), createdAt:new Date().toISOString()}, ...prev]);
    setGbName(""); setGbRole(""); setGbMessage("");
    setGbFeedback("Shown only in this browser session. It was not sent or published.");
  }

  const filteredModules = useMemo(() => {
    if (roadmapFilter === "All") return initialData.modules;
    return initialData.modules.filter((m) =>
      m.phase.toLowerCase().includes(roadmapFilter.toLowerCase()) ||
      m.status.toLowerCase().includes(roadmapFilter.toLowerCase())
    );
  }, [initialData.modules, roadmapFilter]);

  const filteredCerts = useMemo(() => {
    if (certFilter === "All") return initialData.certifications;
    if (certFilter === "Latest") {
      return initialData.certifications.filter((c) => c.isNewUpdate);
    }
    return initialData.certifications.filter((c) => c.category === certFilter);
  }, [initialData.certifications, certFilter]);

  const CERT_PREVIEW_COUNT = 12;
  const visibleCerts = showAllCerts
    ? filteredCerts
    : filteredCerts.slice(0, CERT_PREVIEW_COUNT);

  // Group the visible credentials by their issue month, keeping list order.
  const certGroups = useMemo(() => {
    const groups: Array<{ label: string; items: typeof visibleCerts }> = [];
    for (const cert of visibleCerts) {
      const last = groups[groups.length - 1];
      if (last && last.label === cert.issuedDate) {
        last.items.push(cert);
      } else {
        groups.push({ label: cert.issuedDate, items: [cert] });
      }
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCerts, showAllCerts]);

  const filteredResources = useMemo(() => {
    if (resourceFilter === "All") return resources;
    return resources.filter((r) => r.category === resourceFilter);
  }, [resources, resourceFilter]);

  // Decision Matrix calculation
  const totalDecisionScore =
    frictionScore + shelfLifeScore + artifactScore + survivabilityScore; // out of 20
  const decisionVerdict =
    totalDecisionScore >= 16
      ? {
          badge: "DEEP-DIVE & SHIP NOW",
          color: "text-emerald-300 border-emerald-300/40 bg-emerald-400/15",
          summary:
            "High build friction + strong compounding shelf-life. Turn this into a 2–3 week hands-on repo or Ready Tensor publication.",
        }
      : totalDecisionScore >= 11
      ? {
          badge: "WEEKEND PROTOTYPE SPIKE",
          color: "text-amber-200 border-amber-200/40 bg-amber-300/15",
          summary:
            "Worth testing with a time-boxed spike to verify real utility before committing deeper study hours.",
        }
      : {
          badge: "SKIP / DEFER NOISE",
          color: "text-rose-200 border-rose-200/40 bg-rose-400/15",
          summary:
            "Low compounding value or premature abstraction. Bookmark only and stay focused on fundamentals and active builds.",
        };

  return (
    <div
      style={
        {
          "--base-bg": ATMOSPHERE.base,
          "--c1": ATMOSPHERE.c1,
          "--c2": ATMOSPHERE.c2,
          "--c3": ATMOSPHERE.c3,
          "--c4": ATMOSPHERE.c4,
        } as React.CSSProperties
      }
      className="gradient-canvas min-h-[100dvh] w-full text-[#18112c] relative"
    >
      <div className="scene-status sr-only" role="status" aria-live="polite">{scene ? `Opening ${SCENES.find(item => item.id === scene.target)?.label}` : ""}</div>
      {scene && <div onAnimationEnd={(event) => { if (event.target === event.currentTarget) onSceneAnimationEnd.current(scene.phase); }} className={`scene-transition scene-transition--${scene.phase} scene-transition--${scene.direction}`} style={{"--scene-tint":SCENES.find(item => item.id === scene.target)?.tint} as React.CSSProperties} aria-hidden="true"><div className="scene-transition-inner"><div className="scene-transition-meta"><span>MIII.AI / A LEARNING JOURNEY</span><span>CHAPTER {SCENES.find(item => item.id === scene.target)?.index}</span></div><div className="scene-transition-label"><span>NOW ENTERING</span><strong>{SCENES.find(item => item.id === scene.target)?.label}</strong></div><div className="scene-transition-rule"><span>TAKE YOUR TIME</span><span>LEARN · BUILD · REPEAT</span></div></div></div>}

      {/* Persistent Top Frosted Glass Chrome (mirroring miaws.com's 52px header bar) */}
      <header className="glass-chrome fixed top-0 left-0 right-0 z-50 h-[54px] flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* Pixel Wordmark Brand */}
          <button
            type="button"
            onClick={() => jumpToSection("top")}
            className="font-pixel text-sm sm:text-base tracking-wider text-white hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            miii.ai
          </button>

          <span className="hidden md:block h-4 w-px bg-white/20 shrink-0" />

          {/* Navigation Pills */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-1.5"
          >
            {[
              { id: "roadmap", label: "Roadmap" },
              { id: "projects", label: "Projects" },
              { id: "credentials", label: "Credentials" },
              { id: "resources", label: "Resources" },
              { id: "notes", label: "Field Notes" },
              { id: "decision", label: "Decision Matrix" },
              { id: "story", label: "Journey" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpToSection(item.id)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-light tracking-wider uppercase text-white/90 hover:bg-white/85 hover:text-[#18112c] transition-all cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Controls: Live Pulsing CTA + Home | Canvas Dual-Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            className="hidden sm:inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-[11px] font-normal tracking-wider uppercase text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            <span className="fp-apply-live" aria-hidden="true" />
            ASK THE GUIDE
          </button>

          <div
            role="tablist"
            aria-label="View mode"
            className="inline-flex rounded-full bg-black/25 border border-white/15 p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "home"}
              onClick={() => navigateTo("top")}
              className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-widest transition-all cursor-pointer ${
                viewMode === "home"
                  ? "bg-white/90 text-[#18112c] font-medium shadow-xs"
                  : "text-white/70 hover:text-white font-light"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "canvas"}
              onClick={() => navigateTo("canvas")}
              className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-widest transition-all cursor-pointer ${
                viewMode === "canvas"
                  ? "bg-white/90 text-[#18112c] font-medium shadow-xs"
                  : "text-white/70 hover:text-white font-light"
              }`}
            >
              Canvas
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Over Local guide drawer (accessible anytime from Home view) */}
      {drawerOpen && viewMode === "home" && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="glass-obsidian h-full w-full max-w-md text-white flex flex-col border-l border-white/15"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/12">
              <div className="flex items-center gap-2.5">
                <span className="fp-apply-live" />
                <div>
                  <p className="font-pixel text-sm text-white">miii.ai</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">
                    Local portfolio guide
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigateTo("canvas");
                  }}
                  className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[10px] uppercase text-white/80 hover:bg-white/10 cursor-pointer"
                >
                  Expand Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close assistant"
                  className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-white/16 border border-white/20 px-4 py-2.5 text-sm text-white">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="w-full space-y-2.5">
                      <MiiiMarkdown content={msg.content} />
                      {msg.highlightSection && (
                        <button
                          type="button"
                          onClick={() => jumpToSection(msg.highlightSection)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-200 hover:bg-emerald-400/20 cursor-pointer"
                        >
                          Jump to {msg.highlightSection} 
                        </button>
                      )}
                      {msg.suggestedFollowUps && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedFollowUps.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => sendChatMessage(chip, false)}
                              className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-left text-[11px] text-white/80 hover:bg-white/15 hover:text-white cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <p className="font-mono text-xs text-white/60 animate-pulse">
                  Searching the local guide...
                </p>
              )}
              <div ref={drawerEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!drawerInput.trim()) return;
                sendChatMessage(drawerInput, false);
                setDrawerInput("");
              }}
              className="border-t border-white/12 p-3.5 flex items-center gap-2 bg-white/[0.03]"
            >
              <input
                type="text"
                value={drawerInput}
                onChange={(e) => setDrawerInput(e.target.value)}
                placeholder="Ask Mia's AI guide..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!drawerInput.trim() || isSending}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#18112c] disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* VIEW MODE 2: SPATIAL AI CANVAS (recreating miaws.com's desktop OS mode) */}
      {viewMode === "canvas" ? (
        <AiCanvasWorkspace
          data={initialData}
          messages={messages}
          isSending={isSending}
          onSendMessage={(txt) => sendChatMessage(txt, false)}
          onSwitchToHome={(sec) => jumpToSection(sec)}
        />
      ) : (
        /* VIEW MODE 1: EDITORIAL HOME EXPERIENCE */
        <main id="top" className="relative pt-24 pb-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-24">
          {/* HERO SECTION — Recreating miaws.com's iconic centered pixel wordmark + spaced subtitle + conversational prompt */}
          <section className="pt-6 sm:pt-12 pb-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#18112c]/15 bg-white/35 backdrop-blur-md px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#18112c]/85">
                {initialData.profile.fullName} ({initialData.profile.preferredName}) ·{" "}
                {initialData.profile.location}
              </span>
            </div>

            {/* Iconic Pixel Wordmark matching miaws.com's hero scale */}
            <h1
              className="font-pixel text-[#1e0f32]/90 select-none leading-none tracking-tight"
              style={{
                fontSize: "clamp(58px, 10vw, 128px)",
                textShadow: "0 4px 32px rgba(255, 255, 255, 0.35)",
              }}
            >
              miii.ai
            </h1>

            {/* Spaced Uppercase Tagline Bar (direct homage to miaws.com's stretched sub-bar) */}
            <div className="mt-4 w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 px-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#1e0f32]/75">
              <span>Self-Learning</span>
              <span>·</span>
              <span>Software Dev</span>
              <span>·</span>
              <span>AI Engineering</span>
              <span>·</span>
              <span>Building Systems</span>
            </div>

            {/* Central Positioning Statement Card */}
            <div className="glass-obsidian mt-10 w-full max-w-3xl rounded-3xl p-6 sm:p-9 text-left text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-200/85">
                  00 · Personal Positioning
                </span>
                <span className="font-mono text-[11px] text-white/55">
                  Founder & CEO, {initialData.profile.company}
                </span>
              </div>

              <blockquote className="mt-5 text-xl sm:text-2xl md:text-[27px] font-light leading-[1.35] tracking-tight text-white">
                “{initialData.profile.positioning}”
              </blockquote>

              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-white/75 font-light">
                {initialData.profile.bioShort}
              </p>

              {/* Inline Conversational Prompt Box (bringing miaws.com's prompt-first UX straight to the hero) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!heroPrompt.trim()) {
                    setDrawerOpen(true);
                    return;
                  }
                  sendChatMessage(heroPrompt, true);
                  setHeroPrompt("");
                }}
                className="mt-6 rounded-2xl border border-white/20 bg-white/[0.07] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  type="text"
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder="Search the local guide about my roadmap, new certificates, AI-OS, or free resources..."
                  className="flex-1 bg-transparent px-3.5 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#18112c] hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Ask Local Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo("canvas")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs uppercase tracking-wider text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Canvas
                  </button>
                </div>
              </form>

              {/* Quick Starter Prompt Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  "Latest LinkedIn-listed credentials",
                  "How I decide what to learn next",
                  "Why dashboards lie (AI-OS)",
                  "Free learning resources",
                ].map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => sendChatMessage(pill, true)}
                    className="rounded-full border border-white/14 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75 hover:border-white/35 hover:bg-white/12 hover:text-white transition-all cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Verified Identity Strip */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a
                    href={initialData.profile.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    LinkedIn 
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.readyTensor}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    Ready Tensor 
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.credly}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    Credly 
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    <Github className="h-4 w-4" /> GitHub (@strdst7) 
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.existingPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    aimirah.com 
                  </a>
                </div>
                <span className="font-mono text-[11px] italic text-purple-200/90">
                  “{initialData.profile.guidingPrinciple}”
                </span>
              </div>
            </div>

            {/* 4 Key Operational Telemetry Cards */}
            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl">
              {initialData.profile.stats.map((st) => (
                <div
                  key={st.label}
                  className="glass-frosted rounded-2xl p-4 text-left"
                >
                  <div className="font-pixel text-xl sm:text-2xl text-[#18112c]">
                    {st.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#18112c]/85">
                    {st.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-[#18112c]/65">
                    {st.note}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 01 — PERSONAL LEARNING ROADMAP (M00–M09, inspired by miaws.com's 10-module curriculum) */}
          <section id="roadmap" className="scroll-mt-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                  01 · Personal Learning Roadmap (M00 – M09)
                </span>
                <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                  Ten iterative loops—not a rigid syllabus.
                </h2>
                <p className="mt-2 max-w-2xl text-sm sm:text-[15px] text-[#18112c]/80 font-light">
                  Inspired by modular practice-first design, my roadmap loops between Python fundamentals, fullstack software engineering, data & cloud infrastructure, and agentic AI systems. These are illustrative learning areas, not a checklist of completed achievements. Click any module to explore.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["All", "Fundamentals", "Software", "Agentic", "Cloud", "Learning"].map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRoadmapFilter(tab)}
                      className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer border ${
                        roadmapFilter === tab
                          ? "bg-[#18112c] text-white border-[#18112c]"
                          : "bg-white/35 text-[#18112c] border-white/50 hover:bg-white/60"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filteredModules.map((mod) => {
                const isOpen = expandedModule === mod.code;
                return (
                  <div
                    key={mod.code}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedModule(isOpen ? "" : mod.code); } }}
                    onClick={() =>
                      setExpandedModule(isOpen ? "" : mod.code)
                    }
                    className={`rounded-2xl p-5 transition-all cursor-pointer ${
                      isOpen
                        ? "glass-obsidian text-white ring-1 ring-white/30"
                        : "glass-obsidian-soft text-white hover:bg-[#141028]/85"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-pixel text-xs text-purple-200 bg-white/10 px-2.5 py-1 rounded-lg">
                          {mod.code}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                          {mod.phase}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
                          mod.status === "Shipped"
                            ? "bg-emerald-400/20 text-emerald-200"
                            : mod.status === "Active Loop"
                            ? "bg-amber-300/20 text-amber-200"
                            : "bg-purple-300/20 text-purple-200"
                        }`}
                      >
                        {mod.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-medium text-white">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-xs italic text-purple-200/85">
                      “{mod.tagline}”
                    </p>
                    <p className="mt-2.5 text-sm font-light leading-relaxed text-white/75">
                      {mod.summary}
                    </p>

                    {isOpen && <><div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                        Practice · {mod.deliverableTitle}
                      </div>
                      <p className="mt-1 text-xs text-white/75 leading-relaxed">
                        {mod.deliverableDesc}
                      </p>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {mod.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-md border border-white/12 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/70"
                        >
                          {tool}
                        </span>
                      ))}
                    </div></>}
                  </div>
                );
              })}
            </div>
          <ChapterNavigation current="roadmap" onNavigate={navigateTo} />
          </section>

          {/* SECTION 02 — PROJECTS, EXPERIMENTS & THINGS I BUILT */}
          <section id="projects" className="scroll-mt-20 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                02 · Shipped Systems & Experiments
              </span>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                Things I built to test what I am learning.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {initialData.projects.map((project) => (
                <article
                  key={project.id}
                  className="glass-obsidian rounded-3xl p-6 text-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-emerald-300">
                        {project.code} · {project.domain}
                      </span>
                      <span className="font-mono text-[11px] text-white/50">
                        {project.period}
                      </span>
                    </div>

                    <h3 className="mt-3 text-2xl font-medium text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-purple-200/85">
                      {project.subtitle}
                    </p>

                    <p className="mt-3.5 text-sm font-light leading-relaxed text-white/80">
                      {project.description}
                    </p>

                    <div className="mt-4 border-l-2 border-emerald-300/60 bg-emerald-400/[0.06] pl-3.5 py-2 pr-3 rounded-r-xl">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-200 block">
                        Engineering Lesson
                      </span>
                      <p className="mt-0.5 text-xs text-white/80 leading-relaxed">
                        {project.lesson}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/14 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/75"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-white/80 hover:text-emerald-200 transition-colors"
                      >
                        Project link
                      </a>
                      <a
                        href={project.publicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-purple-200 hover:text-white transition-colors"
                      >
                        Write-up 
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          <ChapterNavigation current="projects" onNavigate={navigateTo} />
          </section>

          {/* SECTION 03 — CERTIFICATIONS, ACHIEVEMENTS & LINKEDIN PORTFOLIO SYNC */}
          <section id="credentials" className="scroll-mt-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                  Certifications, badges & milestones.
                </h2>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "All",
                  "Latest",
                  "AI & Agents",
                  "Data & Analytics",
                  "Cloud & Security",
                  "Software & Web",
                  "Business & Leadership",
                  "Community & Recognition",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCertFilter(cat);
                      setShowAllCerts(false);
                    }}
                    className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer border ${
                      certFilter === cat
                        ? "bg-[#18112c] text-white border-[#18112c]"
                        : "bg-white/35 text-[#18112c] border-white/50 hover:bg-white/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {certGroups.map((group) => (
                <div key={group.label} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#18112c]/80">
                      {group.label}
                    </span>
                    <span className="h-px flex-1 bg-[#18112c]/15" />
                    <span className="font-mono text-[10px] text-[#18112c]/60">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((cert) => (
                      <div
                        key={cert.slug}
                        className={`rounded-2xl p-4 text-white flex flex-col justify-between transition-all ${
                          cert.isNewUpdate
                            ? "glass-obsidian ring-1 ring-emerald-300/45"
                            : "glass-obsidian-soft"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-purple-200">
                              {cert.issuer}
                            </span>
                            {cert.isNewUpdate && (
                              <span className="rounded-full bg-emerald-400/20 border border-emerald-300/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-200 shrink-0">
                                Latest
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-[15px] font-medium leading-snug text-white">
                            {cert.title}
                          </h3>

                          {(cert.credentialId || cert.expires) && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-white/60">
                              {cert.credentialId && <span>{cert.credentialId}</span>}
                              {cert.expires && (
                                <span className="text-amber-200/90">
                                  Expires {cert.expires}
                                </span>
                              )}
                            </div>
                          )}

                          {cert.verificationNote && (<p className="mt-2 text-[11px] leading-relaxed text-white/65">{cert.verificationNote}</p>)}
                          {cert.summary && (
                            <p className="mt-2.5 text-xs font-light leading-relaxed text-white/75">
                              {cert.summary}
                            </p>
                          )}
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-white/45">
                            {cert.category}
                          </span>
                          <a
                            href={cert.credentialUrl || initialData.profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={cert.credentialUrl ? (cert.verificationNote ?? "Open credential") : "Opens the LinkedIn profile, not an individual credential"}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-purple-200 hover:text-white transition-colors"
                          >
                            {cert.credentialUrl ? "View credential" : "LinkedIn profile"}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredCerts.length === 0 && (
                <p className="font-mono text-xs text-[#18112c]/70">
                  No credentials in this category yet.
                </p>
              )}

              {filteredCerts.length > CERT_PREVIEW_COUNT && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllCerts((v) => !v)}
                    className="rounded-full bg-[#18112c] px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:opacity-90 cursor-pointer"
                  >
                    {showAllCerts
                      ? "Show fewer"
                      : `Show all ${filteredCerts.length} credentials`}
                  </button>
                </div>
              )}
            </div>

            {/* Transparent Verification Audit Ledger (STEP 5 & STEP 6) */}
            <div className="glass-frosted rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#18112c]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#18112c]">
                      Credential Verification & Portfolio Gap Audit
                    </h3>
                    <p className="text-xs text-[#18112c]/75">
                      Entries come from your LinkedIn list. Nothing is added beyond it, and anything unconfirmed is flagged here.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuditDrawer((s) => !s)}
                  className="rounded-full bg-[#18112c] px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white hover:opacity-90 cursor-pointer"
                >
                  {showAuditDrawer ? "Hide Audit Log" : "Inspect Audit & Pending Links"}
                </button>
              </div>

              {showAuditDrawer && (
                <div className="mt-4 grid gap-2.5 border-t border-[#18112c]/15 pt-4">
                  {initialData.audit.map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-white/55 p-3.5 text-xs space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-[#18112c]">
                          {row.item}
                        </span>
                        <span className="rounded-full bg-[#18112c]/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#18112c]">
                          {row.status}
                        </span>
                      </div>
                      <p className="text-[#18112c]/75">
                        <strong>Source:</strong> {row.source}
                      </p>
                      <p className="text-[#18112c]/75">
                        <strong>Attention / Action:</strong> {row.actionNeeded}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          <ChapterNavigation current="credentials" onNavigate={navigateTo} />
          </section>

          {/* SECTION 04 — FREE COURSES, PLATFORMS & EDUCATIONAL RESOURCES (session-only) */}
          <section id="resources" className="scroll-mt-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                  04 · Open Curriculum & Resources
                </span>
                <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                  Accessible courses, docs & platforms to explore.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#18112c]/80 font-light">
                  A curated set of starting points for curious learners. Some platforms have paid features. Recommendations added below are visible only in your current session.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["All", "Fundamentals", "Software Dev", "AI Engineering", "Cloud & Data"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setResourceFilter(cat)}
                      className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer border ${
                        resourceFilter === cat
                          ? "bg-[#18112c] text-white border-[#18112c]"
                          : "bg-white/35 text-[#18112c] border-white/50 hover:bg-white/60"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowResourceForm((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-400/30 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-emerald-900 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add a Resource for This Session
                </button>
              </div>
            </div>

            {resFeedback && (
              <div className="rounded-xl bg-[#18112c] text-emerald-200 px-4 py-2.5 font-mono text-xs flex items-center justify-between">
                <span>{resFeedback}</span>
                <button
                  type="button"
                  onClick={() => setResFeedback(null)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {showResourceForm && (
              <form
                onSubmit={handleResourceSubmit}
                className="glass-obsidian rounded-2xl p-5 text-white space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                    Add a Resource for This Session
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowResourceForm(false)}
                    className="text-white/50 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    placeholder="Course or resource title"
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    required
                    value={resProvider}
                    onChange={(e) => setResProvider(e.target.value)}
                    placeholder="Platform / Provider (e.g. fast.ai)"
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                  />
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#1b1533] px-3.5 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="Fundamentals">Fundamentals</option>
                    <option value="Software Dev">Software Dev</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Cloud & Data">Cloud & Data</option>
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="url"
                    required
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    placeholder="https://..."
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    required
                    value={resWhy}
                    onChange={(e) => setResWhy(e.target.value)}
                    placeholder="Why is it useful in practice?"
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={resSubmitting}
                    className="rounded-full bg-white px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#18112c] hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
                  >
                    {resSubmitting ? "Saving..." : "Add for This Session"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-obsidian-soft group rounded-2xl p-5 text-white flex flex-col justify-between hover:bg-[#141028]/90 hover:border-white/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-purple-200">
                        {res.provider}
                      </span>
                      <span className="rounded-full bg-emerald-400/15 border border-emerald-300/30 px-2.5 py-0.5 font-mono text-[9px] uppercase text-emerald-200">
                        {res.recommendedByVisitor ? "Session Pick" : res.costType}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-base font-medium text-white group-hover:text-emerald-200 transition-colors">
                      {res.title}
                    </h3>

                    <p className="mt-2.5 text-xs font-light leading-relaxed text-white/75">
                      {res.whyItWorked}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/55">
                    <span>{res.category}</span>
                    <span className="inline-flex items-center gap-1 text-white/80 group-hover:text-white">
                      Open Resource 
                    </span>
                  </div>
                </a>
              ))}
            </div>
          <ChapterNavigation current="resources" onNavigate={navigateTo} />
          </section>

          {/* SECTION 05 — FIELD NOTES: WHAT WORKED, WHAT DIDN'T & LESSONS LEARNED */}
          <section id="notes" className="scroll-mt-20 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                05 · Honest Engineering Field Notes
              </span>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                What worked, what broke, and what I stopped doing.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fieldNotes.map((note) => {
                const resonated = resonatedIds.includes(note.id);
                return (
                  <article
                    key={note.id}
                    className="glass-obsidian rounded-3xl p-6 text-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            note.tag === "What Worked"
                              ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/35"
                              : note.tag === "What Didn't"
                              ? "bg-rose-400/20 text-rose-200 border border-rose-300/35"
                              : "bg-amber-300/20 text-amber-200 border border-amber-200/35"
                          }`}
                        >
                          {note.tag}
                        </span>
                        <span className="font-mono text-[11px] text-white/50">
                          {note.dateLabel}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-medium leading-snug text-white">
                        {note.title}
                      </h3>

                      <div className="mt-3.5 space-y-2.5 text-xs sm:text-[13px] font-light leading-relaxed text-white/75">
                        <p>
                          <strong className="font-medium text-white/95">Context:</strong>{" "}
                          {note.context}
                        </p>
                        <p>
                          <strong className="font-medium text-white/95">What happened:</strong>{" "}
                          {note.whatHappened}
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-purple-200 block">
                          Takeaway
                        </span>
                        <p className="mt-1 text-xs sm:text-sm text-white/90">
                          {note.takeaway}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                        Learning note
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResonate(note.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all cursor-pointer border ${
                          resonated
                            ? "bg-emerald-400/20 border-emerald-300/50 text-emerald-200"
                            : "bg-white/[0.06] border-white/15 text-white/80 hover:bg-white/15"
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5" />
                        Resonates · {note.resonatesCount} (session)
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          <ChapterNavigation current="notes" onNavigate={navigateTo} />
          </section>

          {/* SECTION 06 — INTERACTIVE DECISION MATRIX ("HOW I DECIDE WHAT TO LEARN NEXT") */}
          <section id="decision" className="scroll-mt-20 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                06 · Learning Evaluation Framework
              </span>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                How I evaluate and decide what to learn next.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#18112c]/80 font-light">
                AI moves too fast to learn everything. Test any topic or tool against the four filters I use before investing deep focus hours.
              </p>
            </div>

            <div className="glass-obsidian rounded-3xl p-6 sm:p-8 text-white grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-2">
                    Candidate Topic, Tool, or Fundamental
                  </label>
                  <input
                    type="text"
                    value={evalTopic}
                    onChange={(e) => setEvalTopic(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/45"
                  />
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {DECISION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setEvalTopic(preset.label);
                          setFrictionScore(preset.friction);
                          setShelfLifeScore(preset.shelfLife);
                          setArtifactScore(preset.artifact);
                          setSurvivabilityScore(preset.survivability);
                        }}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] text-white/75 hover:bg-white/14 hover:text-white cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "1. Real Build Friction",
                      desc: "Did an actual project hit a wall without this?",
                      val: frictionScore,
                      set: setFrictionScore,
                    },
                    {
                      label: "2. Compounding Shelf-Life",
                      desc: "Will this still matter two model cycles from now?",
                      val: shelfLifeScore,
                      set: setShelfLifeScore,
                    },
                    {
                      label: "3. 2-Week Artifact Test",
                      desc: "Can I ship a working repo or demo within 14 days?",
                      val: artifactScore,
                      set: setArtifactScore,
                    },
                    {
                      label: "4. System Survivability",
                      desc: "Does it prevent silent failure after launch?",
                      val: survivabilityScore,
                      set: setSurvivabilityScore,
                    },
                  ].map((slider) => (
                    <div
                      key={slider.label}
                      className="rounded-2xl border border-white/12 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">
                          {slider.label}
                        </span>
                        <span className="font-mono text-xs text-emerald-300">
                          {slider.val}/5
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-white/60">
                        {slider.desc}
                      </p>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={slider.val}
                        onChange={(e) => slider.set(Number(e.target.value))}
                        className="mt-3 w-full accent-purple-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Evaluation Output
                  </span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-pixel text-4xl text-white">
                      {totalDecisionScore}
                    </span>
                    <span className="font-mono text-sm text-white/50">/ 20</span>
                  </div>

                  <div
                    className={`mt-4 inline-block rounded-full border px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider ${decisionVerdict.color}`}
                  >
                    {decisionVerdict.badge}
                  </div>

                  <p className="mt-4 text-sm font-light leading-relaxed text-white/85">
                    {decisionVerdict.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[11px] text-white/60">
                  Rule of thumb: If a topic scores below 12, I read a 10-minute summary and get back to shipping.
                </div>
              </div>
            </div>
          <ChapterNavigation current="decision" onNavigate={navigateTo} />
          </section>

          {/* SECTION 07 — PROFESSIONAL BACKGROUND, WRITING & COLLABORATE GUESTBOOK */}
          <section id="story" className="scroll-mt-20 space-y-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                07 · Background, Writing & Open Channel
              </span>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                From 35,000 feet to engineering AI systems.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Career Arc */}
              <div className="lg:col-span-6 glass-obsidian rounded-3xl p-6 text-white space-y-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-purple-200">
                  The Journey
                </h3>

                <div className="space-y-5">
                  {[
                    {
                      Icon: Plane,
                      org: "Qatar Airways · Global Aviation",
                      role: "Cabin Crew · 9+ Years · 1,500+ Flights · 85+ Countries",
                      desc: "Learned first-hand that complex human-technical systems hold together through clear checklists, calm communication under pressure, and anticipating edge cases before takeoff.",
                    },
                    {
                      Icon: Briefcase,
                      org: "Executive Business Leadership",
                      role: "Deputy COO & Deputy Chief Investment Officer",
                      desc: "Transitioned from global operations into venture strategy, capital discipline, and leading cross-functional teams.",
                    },
                    {
                      Icon: Code2,
                      org: "Self-Taught Software & AI Engineering",
                      role: "Ready Tensor Silver Publisher · Google Cloud Certified",
                      desc: "Built my own non-linear learning loop—shipping RAG assistants, learning tools, and stability architectures while earning project-reviewed credentials.",
                    },
                    {
                      Icon: Building2,
                      org: "MI4 Inc. · Greater Kuala Lumpur",
                      role: "Founder & CEO · Current",
                      desc: "Building modular, production-grade AI systems and governance layers designed to remain reliable long after launch.",
                    },
                  ].map((step) => (
                    <div key={step.org} className="flex gap-3.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-purple-200">
                        <step.Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          {step.org}
                        </h4>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/90 mt-0.5">
                          {step.role}
                        </p>
                        <p className="mt-1.5 text-xs font-light leading-relaxed text-white/75">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Published Writing */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block">
                    Published Writing
                  </span>
                  {initialData.writing.map((w) => (
                    <a
                      key={w.title}
                      href={w.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:border-white/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-purple-200">
                          {w.platform}
                        </span>
                        
                      </div>
                      <p className="mt-1 text-xs font-medium text-white">
                        {w.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Guestbook / Collaborate Channel (session-only) */}
              <div className="lg:col-span-6 glass-obsidian rounded-3xl p-6 text-white flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-300">
                    Open Channel · Say Hello
                  </h3>
                  <p className="mt-2 text-xs font-light leading-relaxed text-white/75">
                    Building in AI systems, self-learning, or reliable infrastructure? Write a temporary note below or email me directly at miii@aimirah.com. Notes are not sent or published.
                  </p>

                  <a href="mailto:miii@aimirah.com" className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-xs font-medium text-[#18112c]">Say hello</a>
                  <form onSubmit={handleGuestbookSubmit} className="mt-4 space-y-3">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        value={gbName}
                        onChange={(e) => setGbName(e.target.value)}
                        placeholder="Your name"
                        className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                      />
                      <input
                        type="text"
                        value={gbRole}
                        onChange={(e) => setGbRole(e.target.value)}
                        placeholder="Role / Org (optional)"
                        className="rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={gbMessage}
                      onChange={(e) => setGbMessage(e.target.value)}
                      placeholder="Share a thought, resource, or collaboration idea..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                    />
                    <div className="flex items-center justify-between gap-2">
                      {gbFeedback ? (
                        <span className="font-mono text-[11px] text-emerald-200">
                          {gbFeedback}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-white/45">
                          Visible in this browser session only; not sent or saved
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={gbSubmitting}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[#18112c] hover:bg-purple-100 disabled:opacity-50 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        {gbSubmitting ? "Posting..." : "Add Temporary Note"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Recent Notes Stream */}
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {guestbook.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-white">
                          {entry.senderName}
                        </span>
                        <span className="font-mono text-[10px] text-purple-200/80">
                          {entry.senderRole}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-light leading-relaxed text-white/80">
                        {entry.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          <ChapterNavigation current="story" onNavigate={navigateTo} />
          </section>

          {/* Footer */}
          <footer className="glass-frosted rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-[#18112c]/80">
            <div className="flex flex-wrap items-center gap-3">
              <CommandKey3D size="clamp(44px, 11vw, 76px)" />
              <span className="font-pixel text-base text-[#18112c]">miii.ai</span>
              <span aria-hidden="true">·</span>
              <span>Nur Amirah Mohd Kamil (Mia) · MI4 Inc. · Kuala Lumpur</span>
            </div>
            <nav aria-label="Footer links" className="footer-nav">
              <button type="button" onClick={() => navigateTo("canvas")} className="footer-link">Open Canvas</button>
              <a href={initialData.profile.links.linkedin} target="_top" className="footer-link">LinkedIn</a>
              <a href={initialData.profile.links.readyTensor} target="_top" className="footer-link">Ready Tensor</a>
              <a href={initialData.profile.links.credly} target="_top" className="footer-link">Credly</a>
              <a href={initialData.profile.links.github} target="_top" className="footer-link"><Github className="h-4 w-4" /> GitHub</a>
              <a href="mailto:miii@aimirah.com" className="footer-link">Say hello</a>
            </nav>
          </footer>
        </main>
      )}
    </div>
  );
}

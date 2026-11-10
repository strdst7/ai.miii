"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  ExternalLink,
  Flame,
  Layers,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
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

  // Interactive states backed by PostgreSQL
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

  // Conversational Agent state (shared between Home drawer & AI Canvas)
  const [heroPrompt, setHeroPrompt] = useState("");
  const [drawerInput, setDrawerInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — I’m the **miii.ai** guide for **Nur Amirah Mohd Kamil (Mia)**.\n\n" +
        "Mia is building her own non-linear self-learning path across **fundamentals, software development, AI engineering, and shipping real systems**.\n\n" +
        "Ask me about her **newly verified Ready Tensor & Google Cloud certifications**, her **10-stage learning roadmap (M00–M09)**, shipped systems like **AI-OS** and **VOILAA**, or how she decides what to learn next.",
      suggestedFollowUps: [
        "What are Mia's latest certifications?",
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "I couldn't retrieve a response right now. Feel free to explore the sections below!",
        suggestedFollowUps: data.suggestedFollowUps,
        highlightSection: data.highlightSection,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Connection hiccup while reaching the miii.ai assistant. Try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function jumpToSection(sectionId?: string) {
    setDrawerOpen(false);
    setViewMode("home");
    if (!sectionId) return;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function handleResourceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (resSubmitting) return;
    setResSubmitting(true);
    setResFeedback(null);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resTitle,
          provider: resProvider,
          category: resCategory,
          url: resUrl,
          whyItWorked: resWhy,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResFeedback(json.error || "Please check your inputs.");
      } else {
        setResources((prev) => [...prev, json.resource]);
        setResTitle("");
        setResProvider("");
        setResUrl("");
        setResWhy("");
        setShowResourceForm(false);
        setResFeedback("Added to the live miii.ai resource library.");
      }
    } catch {
      setResFeedback("Network error while saving resource.");
    } finally {
      setResSubmitting(false);
    }
  }

  async function handleResonate(noteId: number) {
    if (resonatedIds.includes(noteId)) return;
    setResonatedIds((prev) => [...prev, noteId]);
    setFieldNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, resonatesCount: n.resonatesCount + 1 } : n
      )
    );

    try {
      const res = await fetch("/api/notes/resonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });
      if (res.ok) {
        const json = await res.json();
        setFieldNotes((prev) =>
          prev.map((n) => (n.id === noteId ? json.note : n))
        );
      }
    } catch {
      // Keep optimistic count
    }
  }

  async function handleGuestbookSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (gbSubmitting) return;
    setGbSubmitting(true);
    setGbFeedback(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: gbName,
          senderRole: gbRole || "Builder / Reader",
          topic: gbTopic,
          message: gbMessage,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setGbFeedback(json.error || "Please enter your name and message.");
      } else {
        setGuestbook((prev) => [json.entry, ...prev]);
        setGbName("");
        setGbRole("");
        setGbMessage("");
        setGbFeedback("Your note has been posted to miii.ai.");
      }
    } catch {
      setGbFeedback("Network error while sending note.");
    } finally {
      setGbSubmitting(false);
    }
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
              { id: "resources", label: "Free Resources" },
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

        {/* Right Controls: Live Pulsing CTA + Home | AI Canvas Dual-Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            className="hidden sm:inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-[11px] font-normal tracking-wider uppercase text-white hover:bg-white/25 transition-all cursor-pointer"
          >
            <span className="fp-apply-live" aria-hidden="true" />
            ASK MIII.AI !
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
              onClick={() => setViewMode("home")}
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
              onClick={() => setViewMode("canvas")}
              className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-widest transition-all cursor-pointer ${
                viewMode === "canvas"
                  ? "bg-white/90 text-[#18112c] font-medium shadow-xs"
                  : "text-white/70 hover:text-white font-light"
              }`}
            >
              AI Canvas
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Over Conversational AI Drawer (accessible anytime from Home view) */}
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
                    Personal Knowledge Agent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setViewMode("canvas");
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
                          Jump to {msg.highlightSection} →
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
                  Thinking through verified notes...
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
                  placeholder="Ask miii.ai about my roadmap, new certificates, AI-OS, or free resources..."
                  className="flex-1 bg-transparent px-3.5 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#18112c] hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ask Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("canvas")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs uppercase tracking-wider text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    AI Canvas
                  </button>
                </div>
              </form>

              {/* Quick Starter Prompt Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  "Latest Ready Tensor & GCP badges",
                  "How I decide what to learn next",
                  "Why dashboards lie (AI-OS)",
                  "Free courses I actually finished",
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
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.readyTensor}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    Ready Tensor <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.credly}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    Credly <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    GitHub (@strdst7) <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-white/25">·</span>
                  <a
                    href={initialData.profile.links.existingPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white/75 hover:text-emerald-200 transition-colors"
                  >
                    aimirah.com <ArrowUpRight className="h-3.5 w-3.5" />
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
                  Inspired by modular practice-first design, my roadmap loops between Python fundamentals, fullstack software engineering, data & cloud infrastructure, and agentic AI systems. Click any module to inspect its artifact.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["All", "Fundamentals", "Software", "Agentic", "Cloud", "Shipped"].map(
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

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                        Artifact · {mod.deliverableTitle}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 02 — PROJECTS, EXPERIMENTS & THINGS I BUILT */}
          <section id="projects" className="scroll-mt-20 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                02 · Shipped Systems & Experiments
              </span>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                Things I built to test what I actually understood.
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
                        Code <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href={project.publicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-purple-200 hover:text-white transition-colors"
                      >
                        Write-up <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SECTION 03 — CERTIFICATIONS, ACHIEVEMENTS & LINKEDIN PORTFOLIO SYNC */}
          <section id="credentials" className="scroll-mt-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                  03 · Credentials & Learning Receipts
                </span>
                <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                  Certifications, badges & milestones.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#18112c]/80 font-light">
                  {initialData.certifications.length} credentials from July 2025 to November 2026,
                  newest first. Most are free or short courses, so treat them as a record of what I
                  studied rather than proof of mastery. The projects above are where I test whether
                  it stuck. Latest:{" "}
                  <strong className="font-medium text-[#18112c]">
                    Data Science and AI For Decision Making (Harvard Business School Online)
                  </strong>{" "}
                  and{" "}
                  <strong className="font-medium text-[#18112c]">
                    Claude Academy: Claude 101 (Anthropic)
                  </strong>
                  .
                </p>
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
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={cert.verificationNote ?? undefined}
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-200 hover:text-white transition-colors"
                            >
                              View record <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
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
          </section>

          {/* SECTION 04 — FREE COURSES, PLATFORMS & EDUCATIONAL RESOURCES (PostgreSQL-backed) */}
          <section id="resources" className="scroll-mt-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#18112c]/70">
                  04 · Open Curriculum & Free Resources
                </span>
                <h2 className="mt-1.5 text-3xl sm:text-4xl font-light tracking-tight text-[#18112c]">
                  Free courses, docs & platforms that actually work.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#18112c]/80 font-light">
                  You don’t need a €5,300 tuition bill to start engineering AI systems. Here are the free, project-based resources I rely on—plus community recommendations saved live to PostgreSQL.
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
                  Recommend Free Resource
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
                    Add a Free Course or Platform to miii.ai
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
                    {resSubmitting ? "Saving..." : "Save to Library"}
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
                        {res.recommendedByVisitor ? "Community Pick" : res.costType}
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
                      Open Resource <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
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
                        Logged in public
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
                        Resonates · {note.resonatesCount}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
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
                  Verified Trajectory
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
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/50" />
                      </div>
                      <p className="mt-1 text-xs font-medium text-white">
                        {w.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Guestbook / Collaborate Channel (PostgreSQL-backed) */}
              <div className="lg:col-span-6 glass-obsidian rounded-3xl p-6 text-white flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-300">
                    Open Channel · Leave a Note or Collaborate
                  </h3>
                  <p className="mt-2 text-xs font-light leading-relaxed text-white/75">
                    Building in AI systems, self-learning, or reliable infrastructure? Leave a public note below or connect directly on LinkedIn.
                  </p>

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
                          Saved live to PostgreSQL
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={gbSubmitting}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[#18112c] hover:bg-purple-100 disabled:opacity-50 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        {gbSubmitting ? "Posting..." : "Post Note"}
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
          </section>

          {/* Footer */}
          <footer className="glass-frosted rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#18112c]/80">
            <div className="flex flex-wrap items-center gap-3">
              <CommandKey3D size="clamp(44px, 11vw, 76px)" />
              <span className="font-pixel text-base text-[#18112c]">miii.ai</span>
              <span>·</span>
              <span>
                Nur Amirah Mohd Kamil (Mia) · MI4 Inc. · Kuala Lumpur
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode("canvas")}
                className="underline underline-offset-4 hover:text-[#18112c] cursor-pointer"
              >
                Open AI Canvas
              </button>
              <a
                href={initialData.profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
              <a
                href={initialData.profile.links.readyTensor}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Ready Tensor
              </a>
              <a
                href={initialData.profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}

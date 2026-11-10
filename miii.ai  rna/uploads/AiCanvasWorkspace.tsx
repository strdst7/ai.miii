"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  GripHorizontal,
  ExternalLink,
  Award,
  Layers,
  Cpu,
  Compass,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import type {
  PortfolioPayload,
  ChatMessage,
} from "@/types/portfolio";
import { MiiiMarkdown } from "./MiiiMarkdown";

interface PanelState {
  id: "roadmap" | "credentials" | "projects" | "notes";
  title: string;
  code: string;
  open: boolean;
  x: number;
  y: number;
  z: number;
}

interface AiCanvasWorkspaceProps {
  data: PortfolioPayload;
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onSwitchToHome: (sectionId?: string) => void;
}

export function AiCanvasWorkspace({
  data,
  messages,
  isSending,
  onSendMessage,
  onSwitchToHome,
}: AiCanvasWorkspaceProps) {
  const [input, setInput] = useState("");
  const [topZ, setTopZ] = useState(30);
  const [panels, setPanels] = useState<PanelState[]>([
    {
      id: "roadmap",
      title: "Learning Roadmap (M00–M09)",
      code: "WIN-01",
      open: true,
      x: 28,
      y: 74,
      z: 21,
    },
    {
      id: "credentials",
      title: "Verified Credentials & New Badges",
      code: "WIN-02",
      open: true,
      x: 28,
      y: 380,
      z: 22,
    },
    {
      id: "projects",
      title: "Shipped AI Systems",
      code: "WIN-03",
      open: false,
      x: 820,
      y: 74,
      z: 23,
    },
    {
      id: "notes",
      title: "Field Notes & Lessons",
      code: "WIN-04",
      open: false,
      x: 820,
      y: 380,
      z: 24,
    },
  ]);

  const draggingRef = useRef<{
    id: PanelState["id"];
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    // Keep the right-hand panels anchored to the viewport on wide screens.
    // Driven by a media-query subscription rather than a one-shot mount read,
    // so the canvas stays correct when the window is resized.
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia("(min-width: 1200px)");
    const reposition = () => {
      if (!query.matches) return;
      const rightX = Math.max(760, window.innerWidth - 380);
      setPanels((prev) =>
        prev.map((p) =>
          p.id === "projects" || p.id === "notes" ? { ...p, x: rightX } : p
        )
      );
    };

    reposition();
    query.addEventListener("change", reposition);
    return () => query.removeEventListener("change", reposition);
  }, []);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const d = draggingRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      setPanels((prev) =>
        prev.map((p) =>
          p.id === d.id
            ? {
                ...p,
                x: Math.max(12, Math.min(window.innerWidth - 320, d.origX + dx)),
                y: Math.max(64, Math.min(window.innerHeight - 160, d.origY + dy)),
              }
            : p
        )
      );
    }
    function handlePointerUp() {
      draggingRef.current = null;
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function bringToFront(id: PanelState["id"]) {
    setTopZ((z) => {
      const next = z + 1;
      setPanels((prev) =>
        prev.map((p) => (p.id === id ? { ...p, z: next } : p))
      );
      return next;
    });
  }

  function togglePanel(id: PanelState["id"]) {
    setTopZ((z) => {
      const next = z + 1;
      setPanels((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, open: !p.open, z: next } : p
        )
      );
      return next;
    });
  }

  function toggleAllGlobal() {
    const anyClosed = panels.some((p) => !p.open);
    setPanels((prev) => prev.map((p) => ({ ...p, open: anyClosed })));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput("");
  }

  const allOpen = panels.every((p) => p.open);

  return (
    <div className="relative min-h-[100dvh] w-full pt-16 pb-6 px-4 md:px-8 flex flex-col items-center justify-between overflow-x-hidden">
      {/* Sub-toolbar for Spatial OS Window Toggles (mirroring miaws.com's canvas bar) */}
      <div className="relative z-40 mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={toggleAllGlobal}
          className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all cursor-pointer border ${
            allOpen
              ? "bg-white/90 text-[#18112c] border-white font-medium shadow-sm"
              : "bg-black/25 text-white/85 border-white/20 hover:bg-black/35"
          }`}
        >
          {allOpen ? "Close All Windows" : "Global · Open All Windows"}
        </button>

        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => togglePanel(p.id)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] tracking-wider uppercase transition-all cursor-pointer border ${
              p.open
                ? "bg-white/88 text-[#18112c] border-white/60 font-medium"
                : "bg-white/15 text-[#18112c] border-white/30 hover:bg-white/28"
            }`}
          >
            {p.title.split("(")[0].trim()}
          </button>
        ))}
      </div>

      {/* Desktop Draggable Floating OS Windows */}
      <div className="hidden lg:block">
        {panels
          .filter((p) => p.open)
          .map((panel) => (
            <div
              key={panel.id}
              onPointerDown={() => bringToFront(panel.id)}
              style={{
                position: "fixed",
                left: panel.x,
                top: panel.y,
                zIndex: panel.z,
                width: 345,
              }}
              className="glass-obsidian rounded-2xl text-white overflow-hidden select-none transition-shadow"
            >
              {/* Drag Handle Titlebar */}
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  bringToFront(panel.id);
                  draggingRef.current = {
                    id: panel.id,
                    startX: e.clientX,
                    startY: e.clientY,
                    origX: panel.x,
                    origY: panel.y,
                  };
                }}
                className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.04] cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <GripHorizontal className="h-3.5 w-3.5 text-white/40" />
                  <span className="font-mono text-[10px] tracking-widest text-purple-200/80 uppercase">
                    {panel.code}
                  </span>
                  <span className="text-xs font-medium text-white/90">
                    {panel.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePanel(panel.id);
                  }}
                  aria-label={`Close ${panel.title}`}
                  className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Panel Body */}
              <div className="max-h-[250px] overflow-y-auto p-3.5 space-y-2.5 text-xs">
                {panel.id === "roadmap" &&
                  data.modules.map((m) => (
                    <div
                      key={m.code}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 hover:border-purple-300/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-emerald-300">
                          {m.code} · {m.phase}
                        </span>
                        <span className="font-mono text-[9px] uppercase text-white/45">
                          {m.status}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-white">{m.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/65 leading-snug">
                        {m.deliverableTitle}
                      </p>
                    </div>
                  ))}

                {panel.id === "credentials" &&
                  data.certifications.slice(0, 6).map((c) => (
                    <a
                      key={c.slug}
                      href={c.credentialUrl || data.profile.links.credly}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/10 bg-white/[0.04] p-2.5 hover:border-emerald-300/45 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-purple-200">
                          {c.issuer} · {c.issuedDate}
                        </span>
                        {c.isNewUpdate && (
                          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 font-mono text-[9px] text-emerald-200">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-medium text-white flex items-center justify-between gap-1">
                        <span>{c.title}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 text-white/45" />
                      </p>
                    </a>
                  ))}

                {panel.id === "projects" &&
                  data.projects.map((proj) => (
                    <a
                      key={proj.id}
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/10 bg-white/[0.04] p-2.5 hover:border-purple-300/45 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-emerald-300">
                          {proj.code} · {proj.period}
                        </span>
                        <ArrowUpRight className="h-3 w-3 text-white/50" />
                      </div>
                      <p className="mt-1 font-medium text-white">{proj.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/65 line-clamp-2">
                        {proj.subtitle}
                      </p>
                    </a>
                  ))}

                {panel.id === "notes" &&
                  data.fieldNotes.map((note) => (
                    <div
                      key={note.slug}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
                    >
                      <span className="font-mono text-[10px] text-amber-200">
                        {note.tag} · {note.dateLabel}
                      </span>
                      <p className="mt-1 font-medium text-white">{note.title}</p>
                      <p className="mt-1 text-[11px] text-white/65 leading-snug">
                        {note.takeaway}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                <span className="font-mono text-[9px] text-white/40 uppercase">
                  Drag header to reposition
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchToHome(panel.id)}
                  className="font-mono text-[10px] text-purple-200 hover:text-white cursor-pointer"
                >
                  Open full view →
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Centered Conversational Stream (matching miaws.com's centerpiece dialogue column) */}
      <div className="relative z-30 my-auto w-full max-w-2xl flex flex-col items-center">
        <div className="text-center mb-4 select-none">
          <div className="font-pixel text-3xl sm:text-4xl tracking-wider text-[#1e0f32]/90">
            miii.ai
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#1e0f32]/70">
            Interactive Self-Learning Agent · Ask Anything
          </p>
        </div>

        <div className="glass-obsidian w-full rounded-3xl overflow-hidden flex flex-col">
          {/* Messages feed */}
          <div className="max-h-[46dvh] min-h-[250px] overflow-y-auto p-5 sm:p-6 space-y-4">
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
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/55">
                        miii.ai guide
                      </span>
                    </div>
                    <MiiiMarkdown content={msg.content} />

                    {msg.highlightSection && (
                      <button
                        type="button"
                        onClick={() => onSwitchToHome(msg.highlightSection)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-200 hover:bg-emerald-400/20 transition-colors cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3" />
                        Inspect {msg.highlightSection} section in Home view →
                      </button>
                    )}

                    {msg.suggestedFollowUps &&
                      msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedFollowUps.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => onSendMessage(chip)}
                              className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-left text-[11px] text-white/80 hover:border-white/35 hover:bg-white/14 hover:text-white transition-all cursor-pointer"
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
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-300 animate-ping" />
                Synthesizing verified notes...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/12 bg-white/[0.04] p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Mia's certifications, AI-OS, roadmap, or free resources..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#18112c] transition-transform hover:scale-105 disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Mobile/Tablet Quick Panel Strip */}
        <div className="mt-4 grid grid-cols-2 gap-2 w-full lg:hidden">
          {[
            { id: "roadmap", label: "M00–M09 Roadmap", Icon: Layers },
            { id: "credentials", label: "Verified Badges", Icon: Award },
            { id: "projects", label: "Shipped Systems", Icon: Cpu },
            { id: "decision", label: "Decision Matrix", Icon: Compass },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSwitchToHome(id)}
              className="glass-frosted rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#18112c] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom status caption */}
      <div className="relative z-30 mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#1e0f32]/65">
        miii.ai Spatial Canvas · Drag windows on desktop or toggle back to Home
      </div>
    </div>
  );
}

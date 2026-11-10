"use client";

import React from "react";

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      parts.push(
        <em key={match.index} className="italic text-white/90">
          {match[3]}
        </em>
      );
    } else if (match[4] !== undefined) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[0.88em] text-emerald-200"
        >
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function MiiiMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-white/90 font-light">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/90" />
              <span>{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="font-mono text-xs text-purple-200/90 pt-0.5 shrink-0">
                {numMatch[1]}
              </span>
              <span>{renderInline(numMatch[2])}</span>
            </div>
          );
        }
        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

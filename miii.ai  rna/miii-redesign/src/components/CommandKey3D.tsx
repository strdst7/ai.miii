"use client";
import React, { useEffect, useId, useState } from "react";
import { OsGlyph } from "./OsGlyphs";
import { detectOs } from "@/lib/os-detection";
import type { GlyphVariant } from "@/lib/os-detection";
export function CommandKey3D({ size = "64px" }: { size?: string }) {
  const [variant, setVariant] = useState<GlyphVariant>("fallback");
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  useEffect(() => { try { setVariant(detectOs().variant); } catch { /* keep neutral glyph */ } }, []);
  return <span className="command-key-3d" aria-hidden="true" style={{"--ck-width":size} as React.CSSProperties}>
    <span className="ck-contact-shadow" />
    <span className="ck-stage"><span className="ck-key"><span className="ck-base"/><span className="ck-cap"><span className="ck-dish"/><OsGlyph variant={variant} uid={uid}/><span className="ck-gloss"/></span></span></span>
  </span>;
}

"use client";

import React, { useId, useSyncExternalStore } from "react";
import {
  glyphVariantLabel,
  getOsDetectionServerSnapshot,
  getOsDetectionSnapshot,
  subscribeOsDetection,
  type GlyphVariant,
} from "@/lib/os-detection";
import { OsGlyph } from "./OsGlyphs";

/**
 * OS-aware 3D Command Key icon.
 *
 * The keycap geometry, lighting, materials, shadows and proportions are
 * identical for every platform — only the brand glyph on the key changes:
 *
 *   Android → the Android robot      Windows → the Windows logo
 *   Linux   → Tux the penguin        macOS   → the Command (⌘) symbol
 *
 * Detection happens automatically in the browser. The server render and the
 * first client render both paint the neutral Command glyph (they read the same
 * server snapshot), so hydration never mismatches; React then swaps in the
 * detected platform glyph via `useSyncExternalStore` — no effects, no flash of
 * wrong branding, no manual OS selection.
 */

export interface CommandKey3DProps {
  /**
   * Force a specific glyph. Leave undefined for automatic OS detection.
   * Mainly useful for design-system previews and visual regression tests.
   */
  variant?: GlyphVariant;
  /** Rendered width. Numbers are treated as pixels; strings pass through as CSS. */
  size?: number | string;
  /** Extra classes for layout. */
  className?: string;
  /** Override the accessible label. */
  label?: string;
}

const NEUTRAL_LABEL = "3D Command key icon";

function buildLabel(
  variant: GlyphVariant,
  override?: string
): string {
  if (override) return override;
  if (variant === "fallback") return NEUTRAL_LABEL;
  return `3D Command key icon showing the ${glyphVariantLabel(variant)} symbol`;
}

export function CommandKey3D({
  variant,
  size,
  className,
  label,
}: CommandKey3DProps) {
  // Namespace every gradient/filter id so multiple instances can coexist.
  const rawId = useId();
  const uid = `ck${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Read the platform from a tiny external store rather than an effect.
  // The server snapshot is `null`, so the server render and the first client
  // render are byte-identical (both paint the neutral glyph) and hydration
  // never mismatches. React swaps in the detected glyph right after mount.
  const detection = useSyncExternalStore(
    subscribeOsDetection,
    getOsDetectionSnapshot,
    getOsDetectionServerSnapshot
  );

  const activeVariant: GlyphVariant =
    variant ?? detection?.variant ?? "fallback";
  // What the detector actually believes the OS is (may be "unknown").
  const detectedOs: string = variant ?? detection?.os ?? "unknown";
  const detectionSource =
    variant !== undefined
      ? "override"
      : (detection?.source ?? "pending");

  const sizeStyle: React.CSSProperties =
    size === undefined
      ? {}
      : { ["--ck-width" as string]: typeof size === "number" ? `${size}px` : size };

  return (
    <div
      className={`command-key-3d${className ? ` ${className}` : ""}`}
      style={sizeStyle}
      data-os={detectedOs}
      data-variant={activeVariant}
      data-platform={detection?.label ?? "pending"}
      data-detection-source={detectionSource}
      role="img"
      aria-label={buildLabel(activeVariant, label)}
      title={buildLabel(activeVariant, label)}
    >
      {/* Contact shadow on the surface beneath the key (stays flat, un-tilted) */}
      <div className="ck-contact-shadow" aria-hidden="true" />

      {/* Perspective stage */}
      <div className="ck-stage" aria-hidden="true">
        <div className="ck-key">
          {/* Extruded side wall */}
          <div className="ck-base" />
          {/* Top face of the keycap */}
          <div className="ck-cap">
            <div className="ck-dish" />
            <div className="ck-gloss" />
            <OsGlyph variant={activeVariant} uid={uid} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandKey3D;

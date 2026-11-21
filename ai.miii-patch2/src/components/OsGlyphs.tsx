import React from "react";
import type { GlyphVariant } from "@/lib/os-detection";

/**
 * Platform brand glyphs for the 3D Command Key icon.
 *
 * Every glyph is authored on the same 32×32 grid, centred on the same optical
 * axis and pushed through the exact same `emboss` filter, so depth, lighting,
 * shadow direction, proportions and perceived material stay identical across
 * operating systems. Only the brand artwork itself changes.
 *
 * All artwork is inline SVG — no external assets, no extra dependencies.
 */

export interface OsGlyphProps {
  /** Which platform artwork to paint. */
  variant: GlyphVariant;
  /** Per-instance unique id, used to namespace gradients and filters. */
  uid: string;
}

/* ------------------------------------------------------------------ *
 * macOS — the Command symbol (⌘)
 *
 * Geometry: four 270° corner loops joined by four straight segments that are
 * tangent to the *inner* side of each loop. That is what gives the glyph its
 * characteristic "looped square" silhouette rather than a plain rounded
 * square.
 * ------------------------------------------------------------------ */
const COMMAND_PATH =
  "M6.5 11.1A4.6 4.6 0 1 1 11.1 6.5L11.1 25.5A4.6 4.6 0 1 1 6.5 20.9L25.5 20.9A4.6 4.6 0 1 1 20.9 25.5L20.9 6.5A4.6 4.6 0 1 1 25.5 11.1L6.5 11.1Z";

/* ------------------------------------------------------------------ *
 * Shared emboss filter
 *
 * Two chained feDropShadow primitives:
 *   1. a hard white copy offset up-left  → light rim / raised edge
 *   2. a soft dark copy offset down-right → cast shadow
 * Coordinates live in SVG user space, so the effect scales perfectly with the
 * icon instead of being locked to screen pixels.
 * ------------------------------------------------------------------ */
function EmbossFilter({ uid }: { uid: string }) {
  return (
    <filter
      id={`${uid}-emboss`}
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
      colorInterpolationFilters="sRGB"
    >
      <feDropShadow
        dx="-0.5"
        dy="-0.62"
        stdDeviation="0.12"
        floodColor="#ffffff"
        floodOpacity="0.72"
      />
      <feDropShadow
        dx="0.7"
        dy="0.9"
        stdDeviation="0.42"
        floodColor="#1b1030"
        floodOpacity="0.42"
      />
    </filter>
  );
}

/* ------------------------------------------------------------------ *
 * Glyph bodies
 * ------------------------------------------------------------------ */

function CommandGlyph({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient
          id={`${uid}-ink`}
          x1="0"
          y1="0"
          x2="0.25"
          y2="1"
        >
          <stop offset="0" stopColor="#544a7d" />
          <stop offset="0.55" stopColor="#2c2447" />
          <stop offset="1" stopColor="#150f28" />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-emboss)`}>
        <path
          d={COMMAND_PATH}
          fill="none"
          stroke={`url(#${uid}-ink)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

function WindowsGlyph({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient
          id={`${uid}-win`}
          x1="0"
          y1="0"
          x2="0.85"
          y2="1"
        >
          <stop offset="0" stopColor="#1a8fdc" />
          <stop offset="0.5" stopColor="#0f7ed0" />
          <stop offset="1" stopColor="#3fc6f2" />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-emboss)`}>
        <rect x="1.6" y="1.6" width="13" height="13" rx="1.7" fill={`url(#${uid}-win)`} />
        <rect x="17.4" y="1.6" width="13" height="13" rx="1.7" fill={`url(#${uid}-win)`} />
        <rect x="1.6" y="17.4" width="13" height="13" rx="1.7" fill={`url(#${uid}-win)`} />
        <rect x="17.4" y="17.4" width="13" height="13" rx="1.7" fill={`url(#${uid}-win)`} />
      </g>
    </>
  );
}

/* Linux — an original "kernel kitten" mascot (round head, pointed ears, a
   terminal-prompt on its belly). Not a reproduction of any existing logo. */
function LinuxGlyph({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-cat`} x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#46414f" />
          <stop offset="0.5" stopColor="#221d2b" />
          <stop offset="1" stopColor="#100d17" />
        </linearGradient>
        <linearGradient id={`${uid}-nose`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc457" />
          <stop offset="1" stopColor="#ef9a26" />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-emboss)`}>
        {/* ears */}
        <path d="M8.2 9.2L8.6 2.6L14 6.2Z" fill={`url(#${uid}-cat)`} />
        <path d="M23.8 9.2L23.4 2.6L18 6.2Z" fill={`url(#${uid}-cat)`} />
        {/* body */}
        <ellipse cx="16" cy="23.4" rx="7.2" ry="5.6" fill={`url(#${uid}-cat)`} />
        {/* head */}
        <circle cx="16" cy="13.6" r="8.6" fill={`url(#${uid}-cat)`} />
        {/* belly with terminal prompt */}
        <ellipse cx="16" cy="24.2" rx="4.6" ry="3.6" fill="#fdfbf4" />
        <path
          d="M13.6 22.8L15.6 24.2L13.6 25.6M16.8 25.8H19"
          stroke="#2c2447"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* eyes */}
        <circle cx="12.4" cy="12.8" r="2.3" fill="#fdfbf4" />
        <circle cx="19.6" cy="12.8" r="2.3" fill="#fdfbf4" />
        <circle cx="12.8" cy="13" r="1.1" fill="#151021" />
        <circle cx="19.2" cy="13" r="1.1" fill="#151021" />
        {/* nose */}
        <path d="M14.6 16.4H17.4L16 17.9Z" fill={`url(#${uid}-nose)`} />
      </g>
    </>
  );
}

/* Android — an original "box-bot" mascot (square visor head, single antenna).
   Not a reproduction of any existing logo. */
function AndroidGlyph({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-droid`} x1="0.15" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#5ef0a0" />
          <stop offset="0.55" stopColor="#3ddc84" />
          <stop offset="1" stopColor="#1fae63" />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-emboss)`}>
        {/* antenna */}
        <path
          d="M16 5.6V3.4"
          stroke={`url(#${uid}-droid)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="2.7" r="1.4" fill={`url(#${uid}-droid)`} />
        {/* legs */}
        <rect x="11.2" y="25.8" width="3.6" height="3.8" rx="1.6" fill={`url(#${uid}-droid)`} />
        <rect x="17.2" y="25.8" width="3.6" height="3.8" rx="1.6" fill={`url(#${uid}-droid)`} />
        {/* arms */}
        <rect x="4.8" y="18" width="2.9" height="6.6" rx="1.45" fill={`url(#${uid}-droid)`} />
        <rect x="24.3" y="18" width="2.9" height="6.6" rx="1.45" fill={`url(#${uid}-droid)`} />
        {/* torso */}
        <rect x="9" y="17.6" width="14" height="8.2" rx="2.6" fill={`url(#${uid}-droid)`} />
        {/* head */}
        <rect x="7" y="5.6" width="18" height="11" rx="3.6" fill={`url(#${uid}-droid)`} />
        {/* visor + eyes */}
        <rect x="9.6" y="8" width="12.8" height="5.6" rx="2.4" fill="#0f2a1d" />
        <circle cx="13.2" cy="10.8" r="1.2" fill="#b9ffd8" />
        <circle cx="18.8" cy="10.8" r="1.2" fill="#b9ffd8" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Public glyph renderer
 * ------------------------------------------------------------------ */

export function OsGlyph({ variant, uid }: OsGlyphProps) {
  return (
    <svg
      className="ck-glyph"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <EmbossFilter uid={uid} />
      {variant === "windows" && <WindowsGlyph uid={uid} />}
      {variant === "linux" && <LinuxGlyph uid={uid} />}
      {variant === "android" && <AndroidGlyph uid={uid} />}
      {/* macOS and the neutral fallback share the Command (⌘) symbol, which is
          the icon's own identity — it is the only glyph that is never *wrong*. */}
      {(variant === "macos" || variant === "fallback") && (
        <CommandGlyph uid={uid} />
      )}
    </svg>
  );
}

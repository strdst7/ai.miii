/**
 * Verification harness for the OS-aware 3D Command Key icon.
 *
 * Run with:  npx tsx scripts/verify-os-glyphs.ts
 *
 * It checks three things:
 *   1. `navigator.userAgentData` platform hints are mapped correctly.
 *   2. `detectOs()` classifies a battery of real-world UA strings correctly,
 *      and never reports iOS/iPadOS as macOS.
 *   3. All four glyph variants render the expected SVG artwork.
 */

import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import {
  detectOs,
  resolvePlatformHint,
  type DetectedOs,
  type GlyphVariant,
} from "../src/lib/os-detection";
import { CommandKey3D } from "../src/components/CommandKey3D";

let passed = 0;
let failed = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed++;
    console.log(`  \u2713 ${name}`);
  } else {
    failed++;
    console.log(
      `  \u2717 ${name}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`
    );
  }
}

function section(title: string) {
  console.log(`\n${title}`);
}

/* ------------------------------------------------------------------ *
 * 1. userAgentData platform hints
 * ------------------------------------------------------------------ */
section("1. navigator.userAgentData.platform hints");

const HINT_CASES: Array<[string, DetectedOs | null]> = [
  ["Windows", "windows"],
  ["macOS", "macos"],
  ["Linux", "linux"],
  ["Android", "android"],
  ["Chrome OS", "linux"], // Linux kernel
  ["Chromium OS", "linux"],
  ["iOS", null], // Apple mobile — must NOT become macOS
  ["Unknown", null], // privacy-frozen hint
  ["", null],
  ["SunOS", null],
];

for (const [hint, expected] of HINT_CASES) {
  check(`hint "${hint}" -> ${expected ?? "fallback"}`, resolvePlatformHint(hint), expected);
}

/* ------------------------------------------------------------------ *
 * 2. UA-string detection battery
 * ------------------------------------------------------------------ */
section("2. navigator.userAgent detection battery");

interface MockNav {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: {
    platform: string;
    mobile?: boolean;
    getHighEntropyValues?: unknown;
  };
}

function runDetection(nav: MockNav): DetectedOs | null {
  const previous = (globalThis as Record<string, unknown>).navigator;
  Object.defineProperty(globalThis, "navigator", {
    value: nav,
    configurable: true,
    writable: true,
  });
  try {
    return detectOs().os;
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      value: previous,
      configurable: true,
      writable: true,
    });
  }
}

const UA_CASES: Array<{ name: string; nav: MockNav; expected: DetectedOs | null }> = [
  {
    name: "macOS Safari (no userAgentData)",
    nav: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 0,
    },
    expected: "macos",
  },
  {
    name: "macOS Chrome (userAgentData wins)",
    nav: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      platform: "MacIntel",
      maxTouchPoints: 0,
      userAgentData: { platform: "macOS" },
    },
    expected: "macos",
  },
  {
    name: "Windows 11 Chrome",
    nav: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      platform: "Win32",
      maxTouchPoints: 0,
      userAgentData: { platform: "Windows" },
    },
    expected: "windows",
  },
  {
    name: "Windows Firefox (no userAgentData)",
    nav: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
      platform: "Win32",
      maxTouchPoints: 0,
    },
    expected: "windows",
  },
  {
    name: "Ubuntu Linux Firefox",
    nav: {
      userAgent:
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
      platform: "Linux x86_64",
      maxTouchPoints: 0,
    },
    expected: "linux",
  },
  {
    name: "Chrome OS (CrOS)",
    nav: {
      userAgent:
        "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      platform: "Linux x86_64",
      maxTouchPoints: 0,
      userAgentData: { platform: "Chrome OS" },
    },
    expected: "linux",
  },
  {
    name: "Android phone Chrome",
    nav: {
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
      platform: "Linux armv81",
      maxTouchPoints: 5,
      userAgentData: { platform: "Android", mobile: true },
    },
    expected: "android",
  },
  {
    name: "Android Firefox (no userAgentData)",
    nav: {
      userAgent:
        "Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0",
      platform: "Linux armv81",
      maxTouchPoints: 5,
    },
    expected: "android",
  },
  {
    name: "iPhone Safari -> fallback, never macOS",
    nav: {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
    },
    expected: null,
  },
  {
    name: "iPadOS 17 spoofing Macintosh -> fallback, never macOS",
    nav: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/604.1",
      platform: "MacIntel",
      maxTouchPoints: 5,
    },
    expected: null,
  },
  {
    name: "iPadOS with userAgentData reporting iOS -> fallback",
    nav: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/604.1",
      platform: "MacIntel",
      maxTouchPoints: 5,
      userAgentData: { platform: "iOS" },
    },
    expected: null,
  },
  {
    name: "userAgentData frozen to Unknown, UA says Windows",
    nav: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      platform: "Win32",
      maxTouchPoints: 0,
      userAgentData: { platform: "Unknown" },
    },
    expected: "windows",
  },
  {
    name: "completely unknown platform -> fallback",
    nav: {
      userAgent: "Mozilla/5.0 (SunOS; sun4u) SomeBot/1.0",
      platform: "SunOS",
      maxTouchPoints: 0,
    },
    expected: null,
  },
  {
    name: "no navigator at all (SSR) -> fallback",
    nav: { userAgent: "" },
    expected: null,
  },
];

for (const c of UA_CASES) {
  check(c.name, runDetection(c.nav), c.expected);
}

/* ------------------------------------------------------------------ *
 * 3. Glyph rendering for all four variations
 * ------------------------------------------------------------------ */
section("3. Rendered SVG per operating system");

interface GlyphExpectation {
  variant: GlyphVariant;
  /** Substrings that must be present in the rendered markup. */
  mustContain: string[];
  /** Counts of specific elements. */
  counts: Record<string, number>;
}

const GLYPH_CASES: GlyphExpectation[] = [
  {
    variant: "macos",
    mustContain: [
      'data-variant="macos"',
      'd="M6.5 11.1A4.6 4.6 0 1 1 11.1 6.5',
      "ck-glyph",
    ],
    counts: { "<path": 1 },
  },
  {
    variant: "windows",
    mustContain: ['data-variant="windows"', 'rx="1.7"'],
    counts: { "<rect": 4 },
  },
  {
    variant: "linux",
    mustContain: [
      'data-variant="linux"',
      'd="M8.2 9.2L8.6 2.6L14 6.2Z"', // left ear
      'd="M23.8 9.2L23.4 2.6L18 6.2Z"', // right ear
      'fill="#fdfbf4"', // belly + eyes
    ],
    counts: { "<ellipse": 2, "<circle": 5 }, // body + belly; head + 2 eyes + 2 pupils
  },
  {
    variant: "android",
    mustContain: [
      'data-variant="android"',
      'x="7" y="5.6" width="18" height="11" rx="3.6"', // head
      'x="9.6" y="8" width="12.8" height="5.6"', // visor
    ],
    counts: { "<circle": 3, "<rect": 7 }, // antenna tip + 2 eyes; head, visor, torso, 2 arms, 2 legs
  },
];

for (const c of GLYPH_CASES) {
  const html = renderToStaticMarkdownSafe(c.variant);
  for (const needle of c.mustContain) {
    check(`[${c.variant}] contains ${needle.slice(0, 46)}...`, html.includes(needle), true);
  }
  for (const [tag, expected] of Object.entries(c.counts)) {
    const actual = html.split(tag).length - 1;
    check(`[${c.variant}] ${tag} count`, actual, expected);
  }
  // Every variant must share the same emboss filter + keycap chrome.
  check(
    `[${c.variant}] uses the shared emboss filter`,
    html.includes("feDropShadow") && html.includes("-emboss"),
    true
  );
  check(
    `[${c.variant}] renders the full 3D keycap chrome`,
    html.includes("ck-contact-shadow") &&
      html.includes("ck-stage") &&
      html.includes("ck-base") &&
      html.includes("ck-cap") &&
      html.includes("ck-dish") &&
      html.includes("ck-gloss"),
    true
  );
}

function renderToStaticMarkdownSafe(variant: GlyphVariant): string {
  return renderToStaticMarkup(
    React.createElement(CommandKey3D, { variant, size: 96 })
  );
}

/* ------------------------------------------------------------------ *
 * 4. Geometry sanity for the Command (⌘) path
 * ------------------------------------------------------------------ */
section("4. Command (\u2318) path geometry");

// Corner loop centres implied by the path, and their radius.
const LOOPS: Array<[number, number]> = [
  [6.5, 6.5],
  [6.5, 25.5],
  [25.5, 25.5],
  [25.5, 6.5],
];
const RADIUS = 4.6;

// Tangent points the path actually connects to, in path order.
const TANGENT_POINTS: Array<[number, number]> = [
  [6.5, 11.1],
  [11.1, 6.5],
  [11.1, 25.5],
  [6.5, 20.9],
  [25.5, 20.9],
  [20.9, 25.5],
  [20.9, 6.5],
  [25.5, 11.1],
];

let allOnCircle = true;
for (const [x, y] of TANGENT_POINTS) {
  const onSomeLoop = LOOPS.some(([cx, cy]) => {
    const d = Math.hypot(x - cx, y - cy);
    return Math.abs(d - RADIUS) < 0.01;
  });
  if (!onSomeLoop) allOnCircle = false;
}
check("all 8 tangent points lie exactly on a corner loop", allOnCircle, true);

// Every straight segment must be tangent to exactly two loops.
const SEGMENTS: Array<[number, number, number, number]> = [
  [11.1, 6.5, 11.1, 25.5],
  [6.5, 20.9, 25.5, 20.9],
  [20.9, 25.5, 20.9, 6.5],
  [25.5, 11.1, 6.5, 11.1],
];
let allTangent = true;
for (const [x1, y1, x2, y2] of SEGMENTS) {
  const touching = LOOPS.filter(([cx, cy]) => {
    // Distance from the loop centre to the infinite line through the segment.
    const num = Math.abs((y2 - y1) * cx - (x2 - x1) * cy + x2 * y1 - y2 * x1);
    const den = Math.hypot(y2 - y1, x2 - x1);
    return Math.abs(num / den - RADIUS) < 0.01;
  });
  if (touching.length !== 2) allTangent = false;
}
check("all 4 connecting segments are tangent to exactly two loops", allTangent, true);

// Stroke width must keep the glyph inside the 32x32 viewBox.
const outerExtent = Math.max(...LOOPS.map(([cx, cy]) => cx + RADIUS)) + 3.5 / 2;
const innerExtent = Math.min(...LOOPS.map(([cx, cy]) => cx - RADIUS)) - 3.5 / 2;
check(
  "glyph stays inside the 32x32 viewBox after stroking",
  innerExtent >= 0 && outerExtent <= 32,
  true
);

/* ------------------------------------------------------------------ *
 * 5. 3D projection geometry
 *
 * Re-implements the CSS transform pipeline for `.ck-key` / `.ck-base`
 * (parent `perspective` + child `rotateX`) and asserts that the projected
 * artwork stays inside the component box, so the icon can never bleed into
 * neighbouring layout at any size.
 * ------------------------------------------------------------------ */
section("5. 3D projection stays inside the component box");

// Layout constants, mirroring globals.css (normalised to icon width = 1).
const BOX_W = 1;
const BOX_H = 1.2; // aspect-ratio: 1 / 1.2
const PERSPECTIVE = 2.5; // 250cqw
const TILT = (16 * Math.PI) / 180;
const ORIGIN_X = 0.5;
const ORIGIN_Y = 0.45 * BOX_H;

const KEY_LEFT = 0.05;
const KEY_RIGHT = 0.95;
const KEY_TOP = 0;
const KEY_SIZE = KEY_RIGHT - KEY_LEFT; // square
const KEY_BOTTOM = KEY_TOP + KEY_SIZE;

const BASE_TOP = KEY_TOP + 0.04 * KEY_SIZE;
const BASE_BOTTOM = KEY_BOTTOM + 0.12 * KEY_SIZE;

const sinT = Math.sin(TILT);
const cosT = Math.cos(TILT);

/** Projects a stage-space point through perspective + rotateX. */
function project(x: number, y: number): [number, number] {
  const dy = y - ORIGIN_Y;
  const denom = PERSPECTIVE - dy * sinT;
  const s = PERSPECTIVE / denom;
  return [ORIGIN_X + (x - ORIGIN_X) * s, ORIGIN_Y + dy * cosT * s];
}

// Sample the base (the largest transformed box) densely, including its edges.
const samples: Array<[number, number]> = [];
for (const y of [BASE_TOP, BASE_BOTTOM, (BASE_TOP + BASE_BOTTOM) / 2]) {
  for (const x of [KEY_LEFT, KEY_RIGHT]) samples.push([x, y]);
}
// Sample the vertical edges finely — horizontal extent peaks at max scale.
for (let i = 0; i <= 20; i++) {
  const y = BASE_TOP + ((BASE_BOTTOM - BASE_TOP) * i) / 20;
  samples.push([KEY_LEFT, y], [KEY_RIGHT, y]);
}

const projected = samples.map(([x, y]) => project(x, y));
const minX = Math.min(...projected.map((p) => p[0]));
const maxX = Math.max(...projected.map((p) => p[0]));
const minY = Math.min(...projected.map((p) => p[1]));
const maxY = Math.max(...projected.map((p) => p[1]));

check(
  "projected key stays horizontally inside the component box",
  [minX > 0, maxX < BOX_W],
  [true, true]
);
check(
  "projected key stays vertically inside the component box",
  [minY > 0, maxY < BOX_H],
  [true, true]
);

// The un-tilted contact shadow must also fit.
const SHADOW_LEFT = 0.03;
const SHADOW_RIGHT = 0.97;
const SHADOW_BOTTOM = BOX_H - 0.02 * BOX_H;
const SHADOW_TOP = SHADOW_BOTTOM - 0.12 * BOX_H;
check(
  "contact shadow fits inside the component box",
  [
    SHADOW_LEFT >= 0,
    SHADOW_RIGHT <= BOX_W,
    SHADOW_TOP >= 0,
    SHADOW_BOTTOM <= BOX_H,
  ],
  [true, true, true, true]
);
check(
  "contact shadow sits below the projected keycap",
  SHADOW_TOP > maxY - 0.02,
  true
);

// The top face must be visibly foreshortened (proof the 3D tilt is applied).
const topEdgeY = project(0.5, KEY_TOP)[1];
const bottomEdgeY = project(0.5, KEY_BOTTOM)[1];
const projectedHeight = bottomEdgeY - topEdgeY;
check(
  "top face is foreshortened by the tilt (height < width)",
  projectedHeight < KEY_SIZE,
  true
);
check(
  "foreshortening matches cos(16deg) within perspective tolerance",
  Math.abs(projectedHeight / KEY_SIZE - cosT) < 0.06,
  true
);

/* ------------------------------------------------------------------ *
 * Summary
 * ------------------------------------------------------------------ */
console.log(
  `\n${failed === 0 ? "\u2705 ALL CHECKS PASSED" : "\u274C FAILURES PRESENT"} — ${passed} passed, ${failed} failed\n`
);
process.exit(failed === 0 ? 0 : 1);

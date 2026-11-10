/**
 * OS-aware platform detection for the 3D Command Key icon.
 *
 * Design goals
 * ------------
 * 1. Prefer the most reliable browser signal available: User-Agent Client Hints
 *    (`navigator.userAgentData.platform`), which is a structured, low-entropy
 *    value that Chromium browsers expose and that is far harder to misparse
 *    than a raw UA string.
 * 2. Fall back to `navigator.userAgent` (and finally the legacy
 *    `navigator.platform`) for Safari, Firefox and older engines.
 * 3. NEVER let iOS / iPadOS be mistaken for macOS. iPadOS 13+ deliberately
 *    reports `Macintosh` / `MacIntel`, so Apple-mobile signals are checked
 *    *before* the macOS branch.
 * 4. Never guess. When nothing matches reliably we return `os: null` so the
 *    caller can render a neutral glyph instead of a wrong platform badge.
 *
 * This module is intentionally free of React/DOM mutations so it can be unit
 * tested against a battery of UA strings (see `scripts/verify-os-glyphs.mjs`).
 */

/** Operating systems that have a dedicated brand glyph. */
export type DetectedOs = "macos" | "windows" | "linux" | "android";

/**
 * Glyph that should actually be painted.
 * `"fallback"` is the neutral Command (⌘) symbol — the icon's own identity —
 * used whenever the platform is Apple-mobile (iOS/iPadOS) or unrecognised.
 */
export type GlyphVariant = DetectedOs | "fallback";

/** Which signal produced the answer, exposed for debugging/inspection. */
export type DetectionSource =
  | "userAgentData"
  | "userAgent"
  | "legacyPlatform"
  | "unavailable";

export interface OsDetection {
  /** `null` when the platform could not be identified confidently. */
  os: DetectedOs | null;
  /** Glyph to render. Always safe to paint. */
  variant: GlyphVariant;
  /** Human-readable platform description (for tooltips / tests). */
  label: string;
  /** Signal used to reach the decision. */
  source: DetectionSource;
}

/** Minimal shape of the (still non-standard) User-Agent Client Hints API. */
interface UserAgentDataLike {
  platform?: string;
  mobile?: boolean;
  getHighEntropyValues?: (
    hints: readonly string[]
  ) => Promise<Record<string, unknown>>;
}

type NavigatorLike = Navigator & {
  userAgentData?: UserAgentDataLike;
  oscpu?: string;
};

/* ------------------------------------------------------------------ *
 * Regular expressions used only by the UA-string fallback path.
 * ------------------------------------------------------------------ */

/** iPhone / iPad / iPod — must be evaluated before the macOS branch. */
const APPLE_MOBILE_RE = /\b(?:iphone|ipod|ipad)\b/i;

/**
 * Android is tested before Linux because every Android UA string also
 * contains the token "Linux".
 */
const ANDROID_RE = /\bandroid\b/i;

const WINDOWS_RE = /\bwindows\b/i;

/** `Macintosh` / `Mac OS X` — only reached once Apple-mobile is excluded. */
const MACOS_RE = /\b(?:macintosh|mac\s?os\s?x)\b/i;

/** Linux desktop, X11 and Chrome OS (CrOS) — all Linux-kernel platforms. */
const LINUX_RE = /\b(?:linux|x11|cros)\b/i;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function getNavigator(): NavigatorLike | null {
  if (typeof navigator === "undefined") return null;
  return navigator as NavigatorLike;
}

function makeResult(
  os: DetectedOs | null,
  label: string,
  source: DetectionSource
): OsDetection {
  return { os, variant: os ?? "fallback", label, source };
}

/**
 * Maps a structured platform hint (`navigator.userAgentData.platform` or the
 * high-entropy equivalent) onto a supported OS.
 *
 * Returns `null` for anything ambiguous — including `"iOS"`, which is
 * deliberately *not* folded into macOS.
 */
export function resolvePlatformHint(hint: string): DetectedOs | null {
  const h = hint.trim().toLowerCase();
  if (!h || h === "unknown") return null;

  if (h.includes("android")) return "android";
  if (h.includes("ios")) return null; // Apple mobile — never macOS
  if (h.includes("windows")) return "windows";
  if (h.includes("mac")) return "macos";
  // Chrome OS / Chromium OS ship the Linux kernel.
  if (h.includes("chrome os") || h.includes("chromium os")) return "linux";
  if (h.includes("linux")) return "linux";

  return null;
}

/**
 * Detects iPhone/iPad/iPod.
 *
 * iPadOS 13+ spoofs a desktop Mac (`Macintosh` UA + `MacIntel` platform) to
 * request desktop sites. The reliable discriminator is touch: macOS Safari
 * reports `maxTouchPoints === 0`, iPadOS reports >= 2. Combined with the
 * classic iPhone/iPad/iPod tokens this covers the whole Apple-mobile family.
 */
function isAppleMobileDevice(nav: NavigatorLike): boolean {
  const ua = typeof nav.userAgent === "string" ? nav.userAgent : "";
  if (APPLE_MOBILE_RE.test(ua)) return true;

  if (MACOS_RE.test(ua)) {
    const touchPoints =
      typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : 0;
    if (touchPoints > 1) return true;
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Primary detection
 * ------------------------------------------------------------------ */

/**
 * Synchronously determines the visitor's operating system.
 * Safe to call during SSR (returns a neutral result without touching `navigator`).
 */
export function detectOs(): OsDetection {
  const nav = getNavigator();
  if (!nav) {
    return makeResult(null, "Server / no navigator", "unavailable");
  }

  /* ---- 1. User-Agent Client Hints (most reliable) -------------------- */
  const uaData = nav.userAgentData;
  if (uaData && typeof uaData.platform === "string" && uaData.platform) {
    const resolved = resolvePlatformHint(uaData.platform);
    if (resolved) {
      return makeResult(resolved, uaData.platform, "userAgentData");
    }
    // Hint existed but was "Unknown"/"iOS"/unsupported: keep trying below.
  }

  /* ---- 2. UA string fallback (Safari, Firefox, older engines) -------- */
  const ua = typeof nav.userAgent === "string" ? nav.userAgent : "";
  if (ua) {
    // 2a. Android first — its UA also contains "Linux".
    if (ANDROID_RE.test(ua)) {
      return makeResult("android", "Android", "userAgent");
    }

    // 2b. Apple mobile before macOS — iPadOS reports "Macintosh".
    if (isAppleMobileDevice(nav)) {
      return makeResult(null, "iOS / iPadOS", "userAgent");
    }

    // 2c. Windows (desktop, tablet and phone).
    if (WINDOWS_RE.test(ua)) {
      return makeResult("windows", "Windows", "userAgent");
    }

    // 2d. macOS — only reached once Apple-mobile has been ruled out.
    if (MACOS_RE.test(ua)) {
      return makeResult("macos", "macOS", "userAgent");
    }

    // 2e. Linux family (incl. Chrome OS / CrOS, X11).
    if (LINUX_RE.test(ua)) {
      return makeResult("linux", "Linux", "userAgent");
    }
  }

  /* ---- 3. Legacy `navigator.platform` / `oscpu` ---------------------- */
  const legacy = (
    typeof nav.platform === "string" ? nav.platform : nav.oscpu ?? ""
  ).toLowerCase();

  if (legacy) {
    if (legacy.includes("android")) {
      return makeResult("android", "Android", "legacyPlatform");
    }
    if (legacy.includes("win")) {
      return makeResult("windows", "Windows", "legacyPlatform");
    }
    // Guard again: a touch-capable "MacIntel" is an iPad, not a Mac.
    if (legacy.includes("mac") && !isAppleMobileDevice(nav)) {
      return makeResult("macos", "macOS", "legacyPlatform");
    }
    if (legacy.includes("linux") || legacy.includes("x11")) {
      return makeResult("linux", "Linux", "legacyPlatform");
    }
  }

  /* ---- 4. Genuinely unrecognised: stay neutral. ---------------------- */
  return makeResult(null, "Unrecognised platform", "userAgent");
}

/**
 * Optional second pass: asks the browser for the high-entropy `platform`
 * value when the low-entropy hints were inconclusive (e.g. strict privacy
 * modes that freeze `navigator.userAgentData.platform` to `"Unknown"`).
 *
 * Never throws and never overwrites a confident answer with a weaker one.
 */
export async function refineOsDetection(
  base: OsDetection
): Promise<OsDetection> {
  const nav = getNavigator();
  if (!nav || base.os !== null) return base;

  const uaData = nav.userAgentData;
  if (!uaData || typeof uaData.getHighEntropyValues !== "function") return base;

  try {
    const hints = await uaData.getHighEntropyValues(["platform"]);
    const platform =
      typeof hints?.platform === "string" ? hints.platform : "";
    const resolved = resolvePlatformHint(platform);
    if (resolved) return makeResult(resolved, platform, "userAgentData");
  } catch {
    // Permission denied / unsupported — keep the original result.
  }
  return base;
}

/* ------------------------------------------------------------------ *
 * Tiny external store
 *
 * Lets React read the platform through `useSyncExternalStore`, which is the
 * idiomatic way to consume a browser-only signal: it avoids `setState` inside
 * effects and, crucially, keeps the server render and the first client render
 * identical (both read the server snapshot) so hydration never mismatches.
 * ------------------------------------------------------------------ */

let cachedDetection: OsDetection | null = null;
let refinementStarted = false;
const detectionListeners = new Set<() => void>();

function readDetection(): OsDetection {
  if (!cachedDetection) cachedDetection = detectOs();
  return cachedDetection;
}

function emitDetectionChange() {
  for (const listener of detectionListeners) listener();
}

/** Runs the high-entropy refinement at most once, when it can actually help. */
function ensureRefinement() {
  if (refinementStarted) return;
  refinementStarted = true;

  const base = readDetection();
  if (base.os !== null) return;

  void refineOsDetection(base).then((refined) => {
    if (refined !== base) {
      cachedDetection = refined;
      emitDetectionChange();
    }
  });
}

/** Subscribe function for `useSyncExternalStore`. Stable across renders. */
export function subscribeOsDetection(callback: () => void): () => void {
  detectionListeners.add(callback);
  ensureRefinement();
  return () => {
    detectionListeners.delete(callback);
  };
}

/** Client snapshot. Returns `null` until the browser has been consulted. */
export function getOsDetectionSnapshot(): OsDetection | null {
  if (typeof navigator === "undefined") return null;
  return readDetection();
}

/** Server snapshot — always the neutral value, so SSR and hydration agree. */
export function getOsDetectionServerSnapshot(): OsDetection | null {
  return null;
}

/* ------------------------------------------------------------------ *
 * Presentation helpers
 * ------------------------------------------------------------------ */

const PLATFORM_LABELS: Record<GlyphVariant, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  android: "Android",
  fallback: "this platform",
};

/** Accessible label for the icon, e.g. "macOS". */
export function glyphVariantLabel(variant: GlyphVariant): string {
  return PLATFORM_LABELS[variant];
}

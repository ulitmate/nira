#!/usr/bin/env node
// Builds platform outputs from design/tokens/tokens.json (the single source of truth).
//   - design/web/tokens.css     → CSS custom properties for the web app
//   - design/mobile/tokens.ts   → typed tokens for the React Native / Expo app
// Also verifies WCAG contrast for every pair in "contrast-checks" (light + dark).
// Usage: node design/scripts/build-tokens.mjs        (exits 1 if a contrast check fails)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const t = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const HEADER = "/* AUTO-GENERATED from design/tokens/tokens.json — do not edit by hand. */\n";

// ---------- contrast ----------
const lum = (hex) => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

let failed = 0;
for (const mode of ["light", "dark"]) {
  for (const [fg, bg, min] of t["contrast-checks"]) {
    const r = ratio(t.color[mode][fg], t.color[mode][bg]);
    if (r < min) { failed++; console.error(`✗ ${mode}: ${fg} on ${bg} = ${r.toFixed(2)} (needs ${min})`); }
  }
}

// ---------- CSS ----------
const px = (v) => (v === 0 ? "0" : `${v}px`);
const colorVars = (mode, indent) =>
  Object.entries(t.color[mode]).map(([k, v]) => `${indent}--color-${k}: ${v};`).join("\n") + "\n" +
  Object.entries(t.elevation[mode]).map(([k, v]) => `${indent}--elevation-${k}: ${v};`).join("\n");

const staticVars = [
  ...Object.entries(t.font.stack).map(([k, v]) => `  --font-${k}: ${v};`),
  ...Object.entries(t.font.weight).map(([k, v]) => `  --weight-${k}: ${v};`),
  ...Object.entries(t.type).flatMap(([k, s]) => [
    `  --type-${k}-family: var(--font-${s.family});`,
    `  --type-${k}-size: ${s.size / 16}rem;`,
    `  --type-${k}-line: ${s.line / s.size};`,
    `  --type-${k}-weight: ${s.weight};`,
    `  --type-${k}-tracking: ${s.tracking}em;`,
  ]),
  ...Object.entries(t.space).map(([k, v]) => `  --space-${k}: ${px(v)};`),
  ...Object.entries(t.radius).map(([k, v]) => `  --radius-${k}: ${px(v)};`),
  ...Object.entries(t.blur).map(([k, v]) => `  --blur-${k}: ${px(v)};`),
  ...Object.entries(t.motion.duration).map(([k, v]) => `  --duration-${k}: ${v}ms;`),
  ...Object.entries(t.motion.easing).map(([k, v]) => `  --ease-${k}: ${v};`),
  ...Object.entries(t.size).map(([k, v]) => `  --size-${k}: ${px(v)};`),
  ...Object.entries(t.z).map(([k, v]) => `  --z-${k}: ${v};`),
].join("\n");

const css = `${HEADER}/* Breakpoints (use in media queries; CSS vars can't be used there):
${Object.entries(t.breakpoint).map(([k, v]) => ` *   ${k}: ${v}px`).join("\n")}
 * Theme: follows the OS by default. Force with <html data-theme="light|dark">. */

:root {
  color-scheme: light dark;
${staticVars}
${colorVars("light", "  ")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${colorVars("dark", "    ")}
  }
}

:root[data-theme="dark"] {
${colorVars("dark", "  ")}
}

@media (prefers-reduced-motion: reduce) {
  :root {
${Object.keys(t.motion.duration).map((k) => `    --duration-${k}: 0ms;`).join("\n")}
  }
}
`;
writeFileSync(join(root, "web/tokens.css"), css);

// ---------- TypeScript (React Native) ----------
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const camelKeys = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [camel(k), v]));
const ts = `${HEADER}// React Native / Expo tokens. Numbers are density-independent points (dp/pt).
// Usage: const c = colors[scheme]; <View style={{ backgroundColor: c.surface, padding: space[4] }} />

export const colors = ${JSON.stringify({ light: camelKeys(t.color.light), dark: camelKeys(t.color.dark) }, null, 2)} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof typeof colors.light;

/** iOS: use the system font (SF Pro) via fontFamily "System" — never bundle SF. Android: bundle Inter. */
export const fontFamily = ${JSON.stringify(t.font.native, null, 2)} as const;

/** "family" is a key of fontFamily[Platform.OS]. letterSpacing is in points (tracking × size). */
export const type = ${JSON.stringify(Object.fromEntries(Object.entries(t.type).map(([k, s]) => [camel(k), {
  family: s.family, fontSize: s.size, lineHeight: s.line,
  fontWeight: String(s.weight), letterSpacing: +(s.tracking * s.size).toFixed(2),
}])), null, 2)} as const;

export const space = ${JSON.stringify(camelKeys(t.space), null, 2)} as const;
export const radius = ${JSON.stringify(t.radius, null, 2)} as const;
/** Blur radii for expo-blur / @react-native-community/blur (intensity ≈ radius). */
export const blur = ${JSON.stringify(camelKeys(t.blur), null, 2)} as const;
export const size = ${JSON.stringify(camelKeys(t.size), null, 2)} as const;
export const duration = ${JSON.stringify(t.motion.duration, null, 2)} as const;
/** Reanimated withSpring config — the default Nira spring. */
export const spring = ${JSON.stringify(t.motion["spring-native"], null, 2)} as const;
/** Bezier control points for Reanimated's Easing.bezier(...). */
export const easing = ${JSON.stringify(Object.fromEntries(Object.entries(t.motion.easing).map(([k, v]) => [k, v.match(/[\d.]+/g).map(Number)])), null, 2)} as const;

export const phases = ["menstrual", "follicular", "fertile", "luteal"] as const;
export type Phase = (typeof phases)[number];
`;
writeFileSync(join(root, "mobile/tokens.ts"), ts);

console.log(`Built web/tokens.css and mobile/tokens.ts`);
if (failed) { console.error(`${failed} contrast check(s) failed.`); process.exit(1); }
console.log("All contrast checks pass (light + dark).");

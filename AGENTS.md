# Instructions for AI agents and contributors

Nira is a free, privacy-first period and cycle tracker with an AI assistant. There is a web app and a mobile app.

## Design: mandatory for any UI work
Nira has one design language ("Nira Glass") shared by web and mobile. **Before building or changing any screen:**

1. Read [`design/DESIGN.md`](design/DESIGN.md) in full.
2. Look at the reference screens listed in DESIGN.md §14 (web: `design/webapp/*.html`, mobile: `design/mobile/today.html`)
   and their screenshots in [`design/screenshots/`](design/screenshots/). New screens must look like they belong next to them.
   Web screens load `design/webapp/shared.js` for icons, navigation, the cycle ring and theme handling, so reuse it.
3. Use only tokens from `design/web/tokens.css` (web) or `design/mobile/tokens.ts` (mobile).
   **Never hard-code colors, font sizes, radii, shadows or durations.**
4. Reuse the classes in `design/web/components.css` (`.card`, `.btn-brand`, `.chip`, `.segmented`, `.badge`,
   `.confidence`, `.well`, `.glass` and so on). If you need a new reusable pattern, add it there and document it
   in DESIGN.md §7. Do not invent one-off styles.
5. To change a token, edit `design/tokens/tokens.json`, run `node design/scripts/build-tokens.mjs`,
   and make sure all contrast checks pass.

## Rules that are easy to get wrong
- Predicted data is **hatched or dashed, never solid**. Every prediction shows a range and a confidence meter.
- Palette: **glass, black and white, with pink as the only accent.** No gradients, purple, glows, blurred blobs or rainbow effects.
- There is **one `.btn-brand` (solid pink) per screen**. The tab bar's Log button doesn't count.
- Logging autosaves. There is never a "Submit" button.
- Respect light and dark mode, reduced motion and reduced transparency.
- Privacy: make no third-party requests in production (self-host fonts and icons, use no analytics or trackers).
- Copy: plain, honest and non-gendered. The AI never diagnoses. See DESIGN.md §11.

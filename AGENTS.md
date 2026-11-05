# Instructions for AI agents and contributors

Nira is a free, privacy-first period and cycle tracker with an AI assistant. There is a web app and a mobile app.

## Design: mandatory for any UI work
Nira has one design language ("Nira Glass") shared by web and mobile. **Before building or changing any screen:**

1. Read [`design/DESIGN.md`](design/DESIGN.md) in full.
2. Open the reference screen [`design/webapp/today.html`](design/webapp/today.html) and its
   [`design/screenshots/`](design/screenshots/). New screens must look like they belong next to it.
3. Use only tokens from `design/web/tokens.css` (web) or `design/mobile/tokens.ts` (mobile).
   **Never hard-code colors, font sizes, radii, shadows or durations.**
4. Reuse the classes in `design/web/components.css` (`.card`, `.btn-brand`, `.chip`, `.segmented`, `.badge`,
   `.confidence`, `.well`, `.aura`, `.glass` and so on). If you need a new reusable pattern, add it there and document it
   in DESIGN.md §7. Do not invent one-off styles.
5. To change a token, edit `design/tokens/tokens.json`, run `node design/scripts/build-tokens.mjs`,
   and make sure all contrast checks pass.

## Rules that are easy to get wrong
- Predicted data is **hatched or dashed, never solid, and never glowing**. Every prediction shows a range and a confidence meter.
- There is **one `.btn-brand` per screen** and **one `.ai-rim` per screen**.
- Logging autosaves. There is never a "Submit" button.
- Respect light and dark mode, reduced motion and reduced transparency.
- Privacy: make no third-party requests in production (self-host fonts and icons, use no analytics or trackers).
- Copy: plain, honest and non-gendered. The AI never diagnoses. See DESIGN.md §11.

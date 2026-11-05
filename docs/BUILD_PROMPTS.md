# Nira — Build Prompts (start to finish)

These are the prompts to build the real Nira apps, in order. They are written so a model **can't drift** from the approved
design or the privacy rules. Every prompt points to three files that already exist in this repo:

- `AGENTS.md`: rules for any agent
- `design/DESIGN.md`: how everything looks (plus the mockups in `design/webapp/` and `design/mobile/`)
- `docs/SPEC.md`: how everything is built (stack, data model, prediction maths, privacy, AI)

## How to use these prompts

1. **One phase = one new session.** Give the model access to the `nira` repo.
2. Paste the **Start block** below, then the phase prompt underneath it.
3. When the model finishes, check its report: it must say `pnpm check` passed and list anything it skipped.
   Open the screenshots it produced and compare them with `design/screenshots/`.
4. Merge that phase's pull request **before** starting the next phase. Phases build on each other.
5. If something is broken, use the **Fix prompt** at the bottom. To double-check a phase, use the **Review prompt**.

| # | Phase | Result |
|---|---|---|
| 1 | Foundation | Monorepo, tooling, CI, guard script |
| 2 | Core engine | Data model, dates, periods, predictions, insights (fully tested) |
| 3 | Web shell and components | Real React components that match the mockups, plus demo mode |
| 4 | Web storage and security | Encrypted local storage, app lock, export, delete all |
| 5 | Web: Today and logging | The first fully working screen |
| 6 | Web: Calendar and Insights | |
| 7 | Web: Onboarding and Settings | The web app is complete apart from AI |
| 8 | Ask Nira | AI server endpoint plus the web chat |
| 9 | Mobile foundation | Expo app, UI primitives, tab bar, encrypted storage, app lock |
| 10 | Mobile: Today, Log sheet, Calendar, Insights | |
| 11 | Mobile: Ask Nira, Settings, Onboarding, notifications | The mobile app is complete |
| 12 | Quality pass | Accessibility, privacy audit, performance, end-to-end tests |
| 13 | Release prep | Deploy web, store builds, privacy policy, store forms |

---

## Start block (paste at the top of EVERY prompt)

```
You are working on Nira, a free, privacy-first period and cycle tracker (web + mobile) with an AI assistant.

Before writing any code, read these files completely and follow them exactly:
- AGENTS.md
- design/DESIGN.md (the approved design; it is final)
- docs/SPEC.md (stack, folder layout, data model, prediction maths, privacy and AI rules)

Hard rules:
1. The design is approved and final. Match the mockups in design/webapp/*.html and design/mobile/today.html exactly:
   layout, spacing, type, copy and states. Use only design tokens (var(--…) on web, design/mobile/tokens.ts on mobile)
   and the existing components. Never hard-code colors, sizes, fonts, radii, shadows or durations. Never add gradients,
   purple, glows, blobs or new visual styles. Do not edit anything in design/ unless this prompt says so.
2. Follow docs/SPEC.md exactly: the stack, folder layout, data model, the date rules (ISODate strings, never new Date("YYYY-MM-DD"))
   and the prediction maths. Do not add libraries outside the spec without asking. No analytics, trackers, ads, crash
   reporters or runtime third-party requests, ever.
3. Do only this phase. Do not start later phases, and do not refactor unrelated code.
4. If anything in this prompt conflicts with the spec or the design, or is unclear, stop and ask me instead of guessing.
5. Work on a new branch named after the phase. Make small, clear commits. Run `pnpm check` (and the tests this phase
   adds) before every commit, and fix what fails. Never skip, disable or weaken a test or the guard script to get green.
6. When you finish, reply with: what you built, how to run it, the screenshots you took (if any UI), the result of
   `pnpm check`, and an honest list of anything unfinished or uncertain. Then open a pull request.
```

---

## Phase 1: Foundation

```
PHASE 1: FOUNDATION. Set up the monorepo, tooling, CI and guardrails. No product features yet.

Do:
1. Create the monorepo exactly as docs/SPEC.md §3 describes: pnpm workspaces + Turborepo, with apps/web, apps/mobile,
   packages/core, design (as workspace package "@nira/design"), docs, scripts. Use TypeScript strict mode and a shared base tsconfig.
2. apps/web: create a fresh Next.js (App Router, TypeScript) app with one placeholder page that imports
   design/web/tokens.css and design/web/components.css globally and shows the text "Nira" on var(--color-bg).
   Self-host Inter (no runtime Google Fonts requests).
3. apps/mobile: create a fresh Expo app (latest stable SDK, expo-router, TypeScript) with one placeholder screen that imports
   design/mobile/tokens.ts and shows "Nira" using colors[scheme].bg and colors[scheme].text.
4. packages/core: an empty package with src/index.ts, Vitest set up, and one passing smoke test.
5. Tooling: ESLint (TypeScript + React rules), Stylelint (with color-no-hex for apps/**), Prettier, and an .editorconfig.
6. scripts/guard.mjs: implement every check listed in docs/SPEC.md §10.3. Add a tiny test fixture proving that it
   fails on a hex color and on "fonts.googleapis".
7. Root scripts: `pnpm dev:web`, `pnpm dev:mobile`, `pnpm check` (lint + typecheck + test + tokens build + guard).
   The tokens build must fail if the generated files are out of date.
8. GitHub Actions CI: install with pnpm cache, then run `pnpm check`. (Web end-to-end tests are added in Phase 5.)
9. Update README.md with how to install and run the apps.

Done when:
- `pnpm install && pnpm check` passes on a clean clone.
- `pnpm dev:web` shows the placeholder page and `pnpm dev:mobile` starts Expo.
- Adding "#ff0000" to any file in apps/ makes `pnpm check` fail (then remove it).
```

---

## Phase 2: Core engine

```
PHASE 2: CORE ENGINE in packages/core. Pure TypeScript only: no React, DOM or React Native imports. No UI in this phase.

Do (follow docs/SPEC.md §4–§6 exactly):
1. src/types: every type in SPEC §4 with a zod schema, plus the schema version constant.
2. src/dates: ISODate helpers (addDays, diffDays, compare, isBetween, startOfWeek with Monday first, eachDay, today() with an
   injectable clock, formatShort/formatLong using Intl). Never construct Date from a date-only string.
3. src/periods: the period rules from SPEC §4 (logging flow extends or starts a period, spotting never starts one, auto-close,
   manual edit), returning the change plus an "undo" description.
4. src/predictions: next period (median floor, sample sd, halfWidth, confidence), period length, ovulation estimate
   (including the LH override), fertile window, phase of any date (with an isPredicted flag), late-period status, the
   irregular note, and prediction accuracy (re-predicting each past cycle using only earlier data).
5. src/insights: average cycle and period length plus ranges, cycle variation, cycle history rows (period, fertile window,
   in-progress cycle), symptoms by cycle day (share of cycles per day, per symptom), and patterns. A pattern is only
   reported when it appears in at least 3 of the last 6 cycles, worded like the mockups ("Cramps on days 1–2 · Logged in
   5 of your last 6 cycles").
6. src/repo: the NiraRepository interface from SPEC §4, plus an in-memory implementation (used for tests and demo mode).
7. src/demo: the fictional demo dataset from SPEC §9 (period start 2026-10-23, history [27, 29, 28, 31, 26, 29],
   today pinned to 2026-11-05, plus believable logs that match the mockups).
8. src/store: a Zustand store over a NiraRepository (load, selectors for today/calendar/insights, actions for logging with
   autosave and undo).
9. src/copy: every user-facing string used by these modules, following DESIGN.md §11.

Tests (Vitest), at least:
- The SPEC §6 "Sample check" exactly (Nov 18 – 22, most likely Nov 20, medium, ovulation Nov 5, fertile Oct 31 – Nov 6).
- 0 cycles, 1 cycle, 2 cycles; cycles under 15 and over 90 days excluded; an irregular history (sd > 7).
- Late period (1 day and 12 days late); an LH positive override; leap years; month and year boundaries; DST-change days.
- Period logging: extend, gap of 2 days, spotting, undo.
- Prediction accuracy on the demo data.

Done when: `pnpm check` passes and core test coverage for predictions, periods and dates is at least 95% of lines.
```

---

## Phase 3: Web shell and components

```
PHASE 3: WEB SHELL AND COMPONENTS in apps/web. Turn the design system into React components and build the app shell.
Screens still use demo data only.

Do:
1. Port design/webapp/shared.js into typed React components (SPEC §9): Icon (lucide-react with the names in DESIGN.md §6),
   Sidebar, TabBar, PageHeader (actions + noLog), CycleRing (port renderRing exactly: arcs, hatching, ticks, knob, pulse,
   arc fade-in), ConfidenceMeter, PhaseBadge, Chip, Segmented, Switch, ListRow and ListGroup, Sheet, SaveStatus, Card,
   Well and Button variants. Use the classes from design/web/components.css. Do not re-style them.
2. App shell: routes /today, /calendar, /insights, /ask, /settings and /onboarding (onboarding has no sidebar). The
   floating sidebar shows at ≥ 900px and the floating tab bar below that, exactly as in the mockups.
   "/" redirects to /onboarding or /today. Keyboard shortcuts: L, 1–4, "/", Esc.
3. Theme: system / light / dark via data-theme on <html>, with no flash of the wrong theme on load.
4. Demo mode: ?demo=1 loads packages/core/src/demo into the in-memory repository with today pinned. Show a small,
   discreet "Demo data" badge.
5. Build every screen's layout as a static page in demo mode, matching the mockups pixel for pixel (Today, Calendar,
   Insights, Ask, Settings, Onboarding). Logic comes in later phases; for now, hook the components to the demo store.
6. Playwright: a screenshot script that captures every route in demo mode (light and dark, 1440 and 390 wide) into
   artifacts/screens/, plus side-by-side images next to the matching design/screenshots/*.webp in artifacts/parity/.

Done when:
- Every route in demo mode looks the same as its mockup. Include the parity images in your report and point out any
  difference you couldn't fix.
- Nothing overflows horizontally at 390px. Reduced motion and reduced transparency work.
- `pnpm check` passes. No new colors, sizes or styles were added outside tokens.
```

---

## Phase 4: Web storage and security

```
PHASE 4: WEB STORAGE AND SECURITY in apps/web/src/storage. Follow docs/SPEC.md §4 and §7 exactly.

Do:
1. Implement NiraRepository with Dexie (IndexedDB). Every record is stored encrypted as { id, iv, ciphertext } using
   WebCrypto AES-GCM with a non-extractable key kept in IndexedDB. Validate with zod on read and write.
2. Schema versioning with a migrations folder, plus a test migrating v1 to a fake v2.
3. App lock (optional, off by default): a passcode wraps the data key (PBKDF2-SHA256, ≥ 600,000 iterations). Build the
   lock screen with existing components (glass card, step-dot-style passcode dots, the "Unlock" button as the screen's
   one .btn-brand). Lock again after 5 minutes hidden. There is no way to recover a forgotten passcode, and the UI says so
   honestly, offering "Delete all data and start over".
4. Export: download JSON (full) and CSV (day logs). Import JSON with validation and a preview ("Import 214 days and 9 periods?").
5. Delete all data: a sheet that requires typing "delete" and then wipes the key and the database.
6. Wire the store to this repository for normal use (demo mode keeps using the in-memory repository).
7. Tests: encrypt/decrypt round trip, a wrong passcode fails, export→import gives identical data, delete all leaves nothing in
   IndexedDB, and there are no plaintext health values in IndexedDB (test it by reading the raw stores).

Done when: `pnpm check` and the new tests pass, and you've confirmed in the browser devtools that the IndexedDB values are ciphertext.
```

---

## Phase 5: Web Today and logging

```
PHASE 5: WEB TODAY SCREEN AND LOGGING, wired to real data. The visual reference is design/webapp/today.html.

Do:
1. Today uses real store data: ring (cycle day, phase, predicted days hatched), next period range + most likely date +
   confidence, facts (fertile window, ovulation est., typical cycle), caveat note, week strip, cycle-length chart,
   pattern line, and the Ask Nira teaser (links to /ask).
2. Quick log card: flow segmented control, symptom chips, mood chips and note. Every change autosaves with SaveStatus
   ("Saving…" then "Saved"). Period start/extend uses the core rules with an undo toast. Only show the categories enabled in Settings.
3. The "Log today" button / L key focuses the quick log on desktop. On phones, the tab-bar + button opens the log Sheet.
4. Late-period and irregular states, plus the empty state for a brand-new user ("Log your last period to get predictions."),
   all composed from existing components.
5. Playwright end-to-end tests: log flow on 3 days → a period appears → the prediction updates; toggling a symptom
   persists after reload; undo works. Add the end-to-end job to CI.

Done when: real use matches the mockup in look, demo mode still matches its screenshot, end-to-end tests pass in CI,
and `pnpm check` passes.
```

---

## Phase 6: Web Calendar and Insights

```
PHASE 6: WEB CALENDAR AND INSIGHTS, wired to real data. Visual references: design/webapp/calendar.html and insights.html.

Calendar:
- Month grid (Monday first) with previous/next/Today navigation. Logged period days are solid pink, predicted period days
  are hatched pink, fertile window days get the soft pink ring (est.), log dots, and today is outlined.
- Clicking a day selects it and shows its log in the side panel (or below on phones). "Edit log" opens that day in the log
  Sheet. "Period started this day" and editing the period start/end use the core rules.
- "Coming up" card: the next period range + confidence, and the next fertile window (est.). Respect settings.showFertileWindow.
- Full keyboard grid navigation (arrow keys, Home/End, PageUp/PageDown) and complete screen-reader labels per day.

Insights:
- Range segmented control (6 months / 1 year / All time), key-number tiles, cycle history timeline (in-progress cycle
  hatched), symptoms-by-cycle-day heatmap, patterns (only when the core says they're reliable), and prediction accuracy dots.
- Empty and low-data states: "Insights appear after 2 full cycles. You've logged 1 so far."

Tests: Playwright for day selection, month navigation and editing a period from the calendar. Unit tests for any new selectors.

Done when: both screens match their mockups in demo mode, work with real data, and `pnpm check` plus the end-to-end tests pass.
```

---

## Phase 7: Web Onboarding and Settings

```
PHASE 7: WEB ONBOARDING AND SETTINGS. Visual references: design/webapp/onboarding.html and settings.html.

Onboarding (4 steps, step dots, Back / "I'm not sure" / Continue as the one pink button):
1. Welcome: what Nira is, plus the privacy promise (data on this device, encrypted, no ads, never sold). Note for web:
   "Your data lives in this browser. Export it from Settings to keep a copy."
2. "When did your last period start?" (date picker, as in the mockup) → creates a Period with source "onboarding".
3. Typical cycle and period length (steppers with "I'm not sure", which uses the defaults).
4. What to track (switches) and an optional app lock. Finishing sets onboardedAt and goes to /today.
"Skip" goes straight to Today with the empty state.

Settings (exactly the groups in the mockup):
- Your cycle (editable last period start and typical lengths), What to track, Predictions & reminders, Privacy & security
  (app lock, where your data lives, Encrypted backup = "Coming soon" disabled, Export), Ask Nira (toggle, clear history),
  Appearance (theme), and Delete all data.
- "How predictions work": a simple explainer page in plain language that describes SPEC §6 honestly, including the
  calendar-method caveat.
- Web reminders: the browser Notification API, only while the app is open (be honest about that in the row's helper text).

Done when: a brand-new user can go from onboarding to logging to seeing predictions without help; every setting
persists and takes effect; both screens match their mockups; and `pnpm check` plus the end-to-end tests pass.
```

---

## Phase 8: Ask Nira (AI)

```
PHASE 8: ASK NIRA. Server endpoint plus the web chat. Follow docs/SPEC.md §8 exactly. Visual reference: design/webapp/ask.html.

Server (apps/web/src/app/api/ask/route.ts):
1. Node runtime with @anthropic-ai/sdk. Read ANTHROPIC_API_KEY and NIRA_AI_MODEL from env. Check Anthropic's current docs
   for the right model name and streaming API; do not guess.
2. zod-validated body (question ≤ 1,000 characters, context ≤ 8 KB, history ≤ 6 turns). Stream the answer back.
3. The system prompt in apps/web/src/server/ask/system-prompt.ts, written to every rule in SPEC §8 (explain the user's own
   data, no diagnosis, no contraception or "safe days", say what data it used, admit limits, urgent-care red flags,
   plain non-gendered language, short answers).
4. In-memory per-IP rate limit (30 per hour) with a friendly 429 message. No logging of bodies. No storage. Return
   generic errors only.
5. .env.example documents the variables. Never commit keys.

Client:
6. packages/core/src/ask-context builds the summary on-device (no notes, no identifiers) plus the basedOn labels. Unit-test
   that notes and sex dates are never included.
7. The chat page as in the mockup: conversation list (local ChatThreads), thread with streamed answers, typing indicator,
   source badges, suggestions, composer (send = the screen's one pink button), and the disclaimer.
8. The consent sheet on first use, with the exact copy from SPEC §8. Nothing is sent before consent. The settings toggle
   turns the feature off everywhere (the Today teaser hides too).
9. Offline and error states exactly as worded in SPEC §8.
10. Safety evals: a script (not run in CI) that sends 20 test questions (red-flag symptoms, "is today safe for unprotected
    sex", "do I have PCOS", normal questions) and saves the answers to artifacts/ai-evals.md for human review.

Done when: the chat works end to end with a real key; the consent sheet blocks sending until accepted; the evals file shows
safe answers; and `pnpm check` passes. The CI tests mock the AI (no network calls in CI).
```

---

## Phase 9: Mobile foundation

```
PHASE 9: MOBILE FOUNDATION in apps/mobile (Expo). The visual reference is design/mobile/today.html. Follow DESIGN.md §10
(mobile) and docs/SPEC.md.

Do:
1. ui/ primitives that mirror the web components using ONLY design/mobile/tokens.ts: Text (with the type ramp), Card
   (glass via expo-blur, falling back to solid surface when reduce transparency is on), Button variants (brand = solid pink),
   IconButton, Chip, Segmented, Switch, Badge, PhaseBadge, ConfidenceMeter, ListRow/ListGroup, Sheet (floating 8pt from the
   edges, grabber, detents), SaveStatus, and CycleRing (react-native-svg, ported exactly from renderRing, including
   hatching, the knob and the pulse). Use Reanimated springs with the spring token, and respect reduced motion.
2. Navigation with expo-router: tabs Today, Calendar, [+], Insights, Ask, using a floating glass tab bar exactly like the
   mockup. On iOS versions with Liquid Glass, use Expo's native tab bar support if available in the current SDK (check the
   docs); otherwise use expo-blur. The + button opens the log sheet. Settings opens from the Today header.
3. Large titles that collapse on scroll, plus the scroll-edge fade under the tab bar.
4. Storage: NiraRepository on expo-sqlite with SQLCipher. The 256-bit key is in expo-secure-store
   (WHEN_UNLOCKED_THIS_DEVICE_ONLY). Migrations + tests (same rules as Phase 4).
5. App lock with expo-local-authentication (device passcode fallback). Blur the app in the app switcher.
6. Fonts: the system font on iOS, Inter bundled on Android. Dynamic Type / font scaling must work up to 200%.
7. Demo mode via a hidden dev menu (dev builds only) using packages/core/src/demo.

Done when: the app runs on the iOS simulator and an Android emulator; the Today screen in demo mode matches the left
phone in design/mobile/today.html (attach screenshots of both, light and dark); data is encrypted; app lock works; and
`pnpm check` passes.
```

---

## Phase 10: Mobile Today, Log sheet, Calendar, Insights

```
PHASE 10: MOBILE TODAY, LOG SHEET, CALENDAR AND INSIGHTS, wired to the shared store in packages/core.

Do:
1. Today, exactly as in the left phone of design/mobile/today.html: ring hero with next period, week strip, today's log
   summary (Edit opens the sheet), and the Ask Nira teaser. Add the late, irregular and empty states.
2. Log sheet, exactly as in the middle phone: flow, symptoms, mood and note. It autosaves (SaveStatus); "Done" closes it;
   swipe down closes it. Period start/extend uses the undo toast. Haptics: light impact on chip toggles and saves,
   selection on segmented controls, success when a period starts.
3. Calendar and Insights: the same content and rules as the web screens (Phase 6), laid out for one column on a
   phone using the same components. Use native gestures for month swipe.
4. Maestro flows (or detailed manual test steps if Maestro can't run here) for: logging a period, an edit from the
   calendar, and the insights empty state.

Done when: the screens match the mockup and the web screens' content; screenshots are attached (iPhone and Android, light
and dark); there is no layout breakage at the largest text size; and `pnpm check` passes.
```

---

## Phase 11: Mobile Ask Nira, Settings, Onboarding, notifications

```
PHASE 11: MOBILE ASK NIRA, SETTINGS, ONBOARDING AND NOTIFICATIONS.

Do:
1. Ask Nira, as in the right phone of design/mobile/today.html: the same endpoint (EXPO_PUBLIC_API_URL), streaming,
   consent sheet, local threads, offline state and disclaimer. The composer sits above the tab bar, and send is the one
   pink button.
2. Settings: the same groups and rules as web (a native list style built from ListGroup/ListRow). Add "App lock with
   Face ID / fingerprint" and "Blur in app switcher" (always on, shown as info).
3. Onboarding: the same 4 steps as web, laid out for phones, plus a notification permission step that explains why before
   asking.
4. Local notifications with expo-notifications: a period reminder N days before the most likely start (rescheduled
   whenever predictions change) and an optional daily log reminder. The lock-screen text must be discreet (SPEC §7.6).
5. Export (share sheet with JSON/CSV files) and Delete all data (typed confirmation, wipes the database and the secure-store key).

Done when: the full flow works on both platforms (fresh install → onboarding → log → predictions → ask → export →
delete); notifications fire with discreet text; and `pnpm check` passes.
```

---

## Phase 12: Quality pass

```
PHASE 12: QUALITY PASS across web and mobile. Fix what you find; don't add features.

Check and fix:
1. Design fidelity: re-run the parity screenshots for every screen (web 1440 and 390, mobile iOS and Android, light and
   dark) and fix every visible difference from the mockups. List anything intentionally different and why.
2. Accessibility (DESIGN.md §12): axe-core on every web route with zero serious issues; keyboard-only walkthrough;
   VoiceOver/TalkBack labels for the ring, charts, calendar days and chips; 200% text; reduced motion; reduced transparency.
3. Privacy audit: record the network traffic of a full session on web and mobile and confirm the only outgoing request
   with user data is /api/ask after consent. Confirm no plaintext data at rest (IndexedDB, the SQLite file) and no secrets
   in the bundles. Write the findings to docs/PRIVACY_AUDIT.md.
4. Correctness: add tests for any bug you find. Fuzz the period and prediction functions with random histories (property tests).
5. Performance: web Lighthouse ≥ 95 for Performance and Accessibility on /today; mobile Today renders in under 1 s on a mid-range
   Android device; no memory leaks when opening and closing the sheet 50 times.
6. Copy review: every string follows DESIGN.md §11 (plain, honest, non-gendered, no guilt, no "safe days").

Done when: all of the above is fixed or listed with a reason, and `pnpm check` plus all end-to-end tests pass.
```

---

## Phase 13: Release prep

```
PHASE 13: RELEASE PREP. Don't change features or design.

Do:
1. Web deployment: a production build that works on any Node host (document Vercel and a plain Docker option). Add security
   headers (strict CSP with no third-party origins, Referrer-Policy no-referrer, Permissions-Policy). Set the
   ANTHROPIC_API_KEY handling and rate limits for production.
2. Mobile: EAS build profiles (development, preview, production), app icons and splash screens built from the brand mark in
   design/ (ink ring + pink dot on bg), bundle IDs, and versioning.
3. Draft docs/PRIVACY_POLICY.md in plain language that matches what the code actually does (on-device storage, Ask Nira
   data flow, no tracking, deletion). Mark it "DRAFT — needs legal review".
4. Draft the App Store privacy "nutrition label" and the Google Play Data safety answers in docs/STORE_PRIVACY.md, based on the
   Phase 12 audit.
5. Store listing text and screenshot plan (use demo mode for screenshots).
6. README: features, privacy model, how to run, build and release, and how to contribute (link AGENTS.md).

Done when: the production web build runs locally with the CSP enabled and no console errors; EAS preview builds succeed (or
the exact commands for me to run are documented if credentials are needed); and the drafts are ready for my review.
```

---

## Fix prompt (when something is broken)

```
[Paste the Start block first]

FIX ONLY THIS PROBLEM: <describe what you see, where (screen/route, web or mobile, light/dark, screen width), and what
you expected. Attach a screenshot if possible.>

Rules: first reproduce the problem and explain its cause. Then make the smallest fix that solves it, add a test that would
have caught it, and run `pnpm check`. Do not change the design, other features or unrelated code. Report what caused the
problem, what you changed, and how you verified it.
```

## Review prompt (to double-check a phase)

```
[Paste the Start block first]

REVIEW ONLY. Do not change code. Review the pull request / branch <name> for phase <N> against design/DESIGN.md,
docs/SPEC.md and the phase prompt in docs/BUILD_PROMPTS.md.

Report, ranked by severity:
1. Anything that looks different from the mockups (compare screenshots in light and dark, desktop and phone).
2. Hard-coded values, new styles, or banned styles (gradients, purple, glows).
3. Privacy violations (network calls, plaintext storage, logging, third-party SDKs).
4. Date bugs (new Date with a date-only string, UTC shifts) and prediction maths that differs from SPEC §6.
5. Missing states (loading, empty, error, late, offline), missing tests, or accessibility gaps.
6. Anything in the phase's "Done when" list that is not actually done.
For each issue, give the file, the line, and what to do about it.
```

## New screen prompt (for screens not designed yet)

```
[Paste the Start block first]

NEW SCREEN: <name, e.g. "Why this estimate?" explainer>. There is no mockup for it. Design it by composing ONLY existing
components and patterns from design/DESIGN.md (cards, wells, list rows, badges, confidence meter, sheet). First build it as a
static mockup in design/webapp/<name>.html (loading webapp/shared.js like the other mockups), take light/dark and desktop/phone
screenshots into design/screenshots/, add it to the DESIGN.md §14 screen inventory, and STOP so I can approve it. Only after I
approve it, build the real screen in the apps.
```

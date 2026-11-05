# Nira — Technical Spec (v1)

This file is the **single source of truth for how Nira is built**. `design/DESIGN.md` is the source of truth for how
it looks. If a prompt, an issue or your own idea conflicts with either file, **stop and ask** instead of guessing.

---

## 1. Product in one paragraph

Nira is a free, privacy-first period and cycle tracker with an AI assistant, available as a **web app** and a **mobile app**
(iOS and Android). Logging is fast and autosaves. Predictions are honest: always a range plus a confidence level.
**All personal data lives on the user's device, encrypted.** There are no accounts in v1, no ads, no analytics and no trackers.
The only network request that carries personal data is **Ask Nira**, and only after the user consents to it.

---

## 2. Tech stack (fixed — do not swap without asking)

| Area | Choice |
|---|---|
| Repo | **pnpm workspaces + Turborepo** monorepo, TypeScript `strict` everywhere |
| Web app | **Next.js (App Router)** + React. Data screens are client components (no server rendering of user data). |
| Web styling | `design/web/tokens.css` + `design/web/components.css` imported globally, plus **CSS Modules** for layout. Every value is a `var(--…)` token. **No Tailwind, no CSS-in-JS, no UI kits.** |
| Mobile app | **Expo** (latest stable SDK) + **expo-router** + React Native + TypeScript |
| Mobile styling | `StyleSheet` + `design/mobile/tokens.ts` through a small `ui/` primitives folder that mirrors the web components |
| Icons | `lucide-react` (web), `lucide-react-native` (mobile), using the icon names in DESIGN.md §6 |
| Charts and ring | Hand-written SVG (web) and `react-native-svg` (mobile), ported from `design/webapp/shared.js` → `renderRing` |
| State | **Zustand** store in `packages/core` (shared by web and mobile) |
| Validation | **zod** for every stored record and every API payload |
| Dates | `YYYY-MM-DD` **local calendar date strings** plus `date-fns` helpers (see §5) |
| Web storage | **IndexedDB via Dexie**, with each record encrypted using WebCrypto AES-GCM (see §7) |
| Mobile storage | **expo-sqlite with SQLCipher** enabled. The key is kept in **expo-secure-store**. |
| AI | **Anthropic TypeScript SDK** (`@anthropic-ai/sdk`), called **only from the server** (`apps/web` route handler) |
| Tests | **Vitest** (core and units), **Playwright** (web end-to-end and screenshots), **Maestro** (mobile flows, optional) |
| CI | GitHub Actions: install → `pnpm check` → web end-to-end tests |
| Fonts | Web: system font stack, falling back to **Inter, self-hosted** (`next/font/local` or `next/font`, with no runtime Google requests). iOS: system font. Android: bundled Inter. |

---

## 3. Repository layout

```
nira/
├─ apps/
│  ├─ web/                 Next.js app + /api/ask route (the only server code)
│  │  └─ src/{app,components,features,storage,server,lib}
│  └─ mobile/              Expo app
│     └─ src/{app,components,ui,features,storage,lib}
├─ packages/
│  └─ core/                Pure TypeScript with NO DOM and NO React Native imports:
│     └─ src/{types,dates,periods,predictions,insights,ask-context,store,repo,copy}
├─ design/                 Design system, workspace package "@nira/design" (do not edit unless asked)
├─ docs/                   SPEC.md (this file), BUILD_PROMPTS.md
├─ scripts/guard.mjs       Fails CI on design and privacy violations (see §10)
└─ package.json            "check": lint + typecheck + test + tokens build + guard
```

`packages/core` is shared by both apps. **All business logic lives there and is unit-tested.** The apps only render
and store data.

---

## 4. Data model (in `packages/core/src/types`, with a zod schema for each)

```ts
type ISODate = string;            // "2026-11-05" — a LOCAL calendar date, never a timestamp

type Flow = "none" | "spotting" | "light" | "medium" | "heavy";
type SymptomId = "cramps" | "bloating" | "headache" | "tender_breasts" | "acne" | "fatigue"
               | "back_pain" | "nausea" | "cravings" | "insomnia" | "discharge";   // extendable list in core/copy
type MoodId = "calm" | "energetic" | "happy" | "irritable" | "anxious" | "low" | "stressed";

interface DayLog {
  date: ISODate;                  // primary key
  flow?: Flow;
  symptoms: SymptomId[];
  moods: MoodId[];
  sex?: "none" | "protected" | "unprotected";
  sleepHours?: number;            // 0–24
  bbtCelsius?: number;            // 34–40
  lhTest?: "positive" | "negative";
  note?: string;                  // max 2000 chars, never sent to the AI
  updatedAt: number;              // epoch ms, for sorting only
}

interface Period { id: string; start: ISODate; end?: ISODate; source: "logged" | "onboarding" | "edited"; }

interface Settings {
  tracking: { symptoms: boolean; mood: boolean; discharge: boolean; sex: boolean; sleep: boolean; bbt: boolean; lh: boolean };
  showFertileWindow: boolean;
  typicalCycleLength?: number;    // from onboarding, used until there are 2+ real cycles
  typicalPeriodLength?: number;
  periodReminderDays: 0 | 1 | 2 | 3;   // 0 = off
  dailyReminder: boolean;
  appLock: boolean;
  aiEnabled: boolean;
  aiConsentAt?: number;           // set when the user accepts the Ask Nira consent sheet
  theme: "system" | "light" | "dark";
  onboardedAt?: number;
}

interface ChatThread { id: string; title: string; createdAt: number; messages: ChatMessage[]; }
interface ChatMessage { role: "user" | "assistant"; text: string; at: number; basedOn?: string[]; }
```

**Periods are the source of truth for cycles.** Logging flow of `light` or heavier on a day:
- inside an existing period, or within 2 days after its end → extends that period;
- otherwise → starts a new period and shows an undo toast ("Started a new period on Nov 20 · Undo").

`spotting` never starts a period. A period with no logged flow for 2 days auto-closes at the last flow day.
The user can always edit start and end dates directly.

Storage goes through one interface in `packages/core/src/repo`:
`NiraRepository { getDay, putDay, listDays(range), listPeriods, putPeriod, deletePeriod, getSettings, putSettings, listThreads, putThread, deleteThread, exportAll, importAll, deleteAll }`.
Each app implements it. **Every schema change bumps a version and ships a migration.**

---

## 5. Dates (the #1 source of bugs — follow exactly)

- Store and compare dates as `ISODate` strings. **Never** use `new Date("2026-11-05")`, which is parsed as UTC and shifts the day.
- All date maths goes through `packages/core/src/dates` (`addDays`, `diffDays`, `today()`, `parseISODate`, `formatShort`…),
  built on `date-fns` with local time. `today()` must be injectable so tests and demo mode can pin it.
- Display formatting uses `Intl.DateTimeFormat` with the user's locale (e.g. "Thu, Nov 20", "Thursday, November 5").
- Weeks start on Monday by default (later this will follow the locale).

---

## 6. Predictions (implement exactly; unit-test every rule)

**Definitions**
- Cycle `i` = from `periods[i].start` up to the day before `periods[i+1].start`. Cycle length = difference in days.
- Only *complete* cycles count. Cycles shorter than 15 days or longer than 90 days are kept but **excluded** from the maths and
  flagged in Insights.
- `recent` = the last **6** valid cycle lengths.

**Next period**
- `L` (expected cycle length) = **median** of `recent`. If there are fewer than 2 valid cycles, use `settings.typicalCycleLength ?? 28`.
- `mostLikelyStart = lastPeriod.start + L`.
- `halfWidth` = `clamp(round(sd(recent)), 1, 7)`. With fewer than 3 cycles, use `3`.
- Range = `mostLikelyStart − halfWidth … mostLikelyStart + halfWidth`.
- Confidence: **high** if there are ≥ 6 cycles and sd ≤ 1.5. **medium** if there are ≥ 3 cycles and sd ≤ 3.5. Otherwise **low**.
- Expected period length `P` = median of logged period lengths (last 6), else `settings.typicalPeriodLength ?? 5`.

**Ovulation and fertile window (always labelled “est.”)**
- Estimated ovulation cycle day = `L − 14` (minimum day 8).
- If a positive LH test is logged in the current cycle, ovulation = the day after the first positive test, and the label becomes
  "Based on your LH test".
- Fertile window = ovulation day − 5 … ovulation day + 1.
- Never say "safe days" and never imply contraception. The caveat "Calendar-based estimate, not birth control." appears wherever
  fertility is shown.

**Phase of a date** (drives every color in the UI)
`menstrual` (logged period days, or predicted `mostLikelyStart … +P−1`) → `follicular` → `fertile` (window) → `luteal` → next.
Every day after today is **predicted** and must render hatched.

**Late and irregular**
- Today past the range end and no new period → "Your period is N days later than expected." This is calm, informational copy:
  no red and no alarm. After 10+ days, add one line suggesting a pregnancy test if relevant, or talking to a clinician.
- If sd > 7, show confidence low with the note "Your cycles vary a lot, so predictions are less certain."

**Cycle variation (Insights):** sample sd rounded to 0.1, shown as "± 1.8 days". Label: sd ≤ 3.5 → "Regular for you",
sd ≤ 7 → "Varies a bit", sd > 7 → "Varies a lot".

**Prediction accuracy (Insights)**
For each of the last 6 cycles, re-run the predictor using only the data available before that cycle started. A hit is when the
actual start was within ±2 days of `mostLikelyStart`.

**Rounding (no ambiguity):** `L = Math.floor(median(recent))`. `sd` is the **sample** standard deviation (divide by n − 1).

**Sample check (must be a unit test):** cycles `[27, 29, 28, 31, 26, 29]`, last start `2026-10-23` →
median 28.5 → **L = 28** → most likely **2026-11-20** · sd ≈ 1.75 → halfWidth **2** → range **Nov 18 – 22** ·
6 cycles but sd > 1.5 → confidence **medium** · ovulation cycle day 14 = **2026-11-05** · fertile window **Oct 31 – Nov 6**.
The design mockups use exactly these numbers. If the engine and a mockup ever disagree, the engine (this spec) is right.

---

## 7. Privacy and security (non-negotiable)

1. **No accounts, ads, analytics, crash reporters, trackers, A/B tools or third-party SDKs** that send data off the device.
   No Google Fonts or CDN requests at runtime. The CI guard enforces this.
2. **Web encryption at rest:** generate a non-extractable AES-GCM `CryptoKey` and keep it in IndexedDB. Each record is stored as
   `{ id, iv, ciphertext }`. With app lock on, wrap the key with a key derived from the passcode (PBKDF2-SHA256, ≥ 600,000 iterations).
3. **Mobile encryption at rest:** SQLCipher database. The random 256-bit key lives in `expo-secure-store` with
   `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. App lock uses `expo-local-authentication` with a device-passcode fallback.
   Blur the app content when it goes to the background (app switcher).
4. **Export** (JSON plus CSV) and **Delete all data** (with typed confirmation "delete") work fully offline.
5. Web data lives in this browser only. Tell the user once (during onboarding) and in Settings, and recommend exporting.
6. Notifications must be discreet on the lock screen: "Nira · Time for a quick check-in". Never put cycle details in a notification.
7. Encrypted backup and sync are **not in v1**. Show the Settings row as "Coming soon" and disabled. Never pretend it works.

---

## 8. Ask Nira (AI) rules

**Flow:** on first use, a consent sheet explains exactly what is sent. Nothing is sent until the user taps "Continue".
`settings.aiConsentAt` records consent. The AI can be turned off in Settings.

**What is sent** (built on-device by `packages/core/src/ask-context`):
- The question, plus up to the last 6 turns of the current thread.
- A compact summary: cycle lengths (last 6), period lengths, current cycle day and phase, the prediction range and confidence,
  symptom and mood counts by phase (last 6 cycles), and averages of sleep, BBT and LH results if tracked.
- **Never sent:** notes, exact dates of sex, any identifiers, or the device ID. Round dates to cycle days where possible.
- `basedOn` labels (e.g. "6 cycles", "41 symptom logs") are computed on-device and shown as source badges under the answer.

**Server** (`apps/web/src/app/api/ask/route.ts`, Node runtime):
- Validate the body with zod (max question 1,000 characters, max context 8 KB). Stream the answer back (SSE or a ReadableStream).
- `ANTHROPIC_API_KEY` and `NIRA_AI_MODEL` come from the environment. Pick the model from Anthropic's current docs; don't hard-code an old one.
- **No logging of request or response bodies.** No storage. Rate-limit per IP (e.g. 30 requests per hour), in memory, with an
  optional Redis adapter behind an env flag.
- The system prompt lives in `apps/web/src/server/ask/system-prompt.ts`. It must:
  explain the user's own data in plain, non-gendered language; never diagnose; never give contraception or "safe days" advice;
  say what data it used; say when the data can't answer; and give urgent-care guidance for red flags (soaking a pad or tampon every hour
  for several hours, severe or sudden pain, fainting, pregnancy with pain or bleeding, fever with pelvic pain).
- Mobile calls the same endpoint (`EXPO_PUBLIC_API_URL`).

**Client:** threads are stored locally (`ChatThread`) and can be deleted. Show a typing indicator, streamed text and the disclaimer
"Nira explains your data and can be wrong. It can't diagnose." When offline: "Ask Nira needs a connection. Your data stays on this device."

**Consent copy** (have the owner verify it against the AI provider's current terms before launch):
"To answer, Nira sends your question and a summary of your cycle data (no notes, no names) to our server and to our AI provider,
Anthropic. It isn't stored by Nira. You can turn Ask Nira off anytime in Settings."

---

## 9. UI implementation rules (how to turn the mockups into real screens)

- The mockups in `design/webapp/*.html` and `design/mobile/today.html` are the **visual spec**. Match layout, spacing, type,
  copy and states. If something isn't in a mockup, compose it from existing components following DESIGN.md. Don't invent new styles.
- Port `design/webapp/shared.js` into components: `Icon`, `Sidebar`, `TabBar`, `PageHeader` (with `actions` / `noLog`),
  `CycleRing`, `ConfidenceMeter`, `PhaseBadge`, `Chip`, `Segmented`, `Switch`, `ListRow`, `Sheet`, `SaveStatus`.
- **Demo mode** (`?demo=1` on web, a dev menu toggle on mobile) loads the exact fictional sample data from the mockups
  (period start 2026-10-23, history `[27, 29, 28, 31, 26, 29]`, today pinned to 2026-11-05) into an **in-memory** repository.
  It never touches real data. It is used for screenshots and visual parity checks.
- Every screen needs: loading (skeletons), empty state (one sentence plus one action), error state, light and dark mode,
  reduced motion and reduced transparency, keyboard access (web), and screen-reader labels (ring and charts get text alternatives).
- Copy lives in `packages/core/src/copy` (one place, ready for i18n later). Follow DESIGN.md §11.

---

## 10. Quality gates (run before every commit; CI runs them too)

`pnpm check` must pass. It runs:
1. `lint` (ESLint + Stylelint), `typecheck` (tsc --noEmit for every package), `test` (Vitest)
2. `node design/scripts/build-tokens.mjs` (contrast checks), and fails if the generated files changed but weren't committed
3. `node scripts/guard.mjs`, which fails on any of the following in `apps/**` and `packages/**`:
   - hex, `rgb(` or `hsl(` colors, or raw `px` font sizes outside `design/` (use tokens);
   - `radial-gradient`, `conic-gradient`, or the words purple or violet in styles (DESIGN.md bans them);
   - `fonts.googleapis`, `gtag`, `google-analytics`, `segment`, `mixpanel`, `amplitude`, `posthog`, `sentry`, `hotjar`;
   - `console.log` in `apps/web/src/server/**` (no logging of AI traffic);
   - `new Date("` with a date-only string.

Web end-to-end tests (Playwright) cover: onboarding → log a period → prediction appears → calendar shows hatched days →
export → delete all. Screenshot tests run in demo mode for every screen in light and dark mode at 1440 and 390 widths.

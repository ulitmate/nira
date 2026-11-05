# Nira Design Language — v3.0 "Nira Glass"

One design language for the **web app** and the **mobile app** (iOS and Android).
It is built on the ideas behind Apple's current design language (Liquid Glass and the Human
Interface Guidelines): translucent glass layers, content first, bold type hierarchy and fluid motion.
The palette is deliberately restrained: **glass, black and white, with pink as the only accent.**
No gradients, no glowing blobs and no rainbow effects. Nira's signature is the cycle ring and honest predictions.

**Before building any Nira screen, read this file, then copy patterns from the reference screens in §14.**
Screenshots of every screen (light, dark, desktop and phone) are in [`screenshots/`](screenshots/).

| What | Where |
|---|---|
| Tokens: the single source of truth | [`tokens/tokens.json`](tokens/tokens.json) |
| Web tokens (generated) | [`web/tokens.css`](web/tokens.css) |
| Web components | [`web/components.css`](web/components.css) |
| Mobile tokens (generated, React Native / Expo) | [`mobile/tokens.ts`](mobile/tokens.ts) |
| Build + WCAG contrast check | `node design/scripts/build-tokens.mjs` |
| Shared web shell: icons, sidebar, tab bar, cycle ring, theme | [`webapp/shared.js`](webapp/shared.js) |
| Reference screens (web + mobile) | §14 below |

---

## 1. The feeling: premium, calm, honest

Nira is a free, privacy-first period and cycle tracker with an AI assistant. It should feel like a
**first-party Apple app**: precise, calm and quietly impressive. It should never look like a flowery "femtech" app or a generic AI product.

**The wow comes from:** real glass depth (floating, translucent controls), bold type (a huge rounded cycle-day
number), strong black-and-white contrast with one confident pink, and fluid motion (spring physics and staggered entrances).

**Banned (it reads as "AI slop"):** gradient backgrounds, blurred color blobs, purple or violet, neon glows, rainbow or
iridescent borders, and gradient text or buttons.

**It stays trustworthy through:** restraint in controls, plain language, and honest data.

### Principles
1. **Content first, controls float.** There are two layers. The *content layer* is a plain background plus the cards that hold content. The *control layer* is
   floating glass navigation, buttons and sheets. Controls never compete with content for color.
2. **Honest over impressive.** Every prediction shows a *range* and a *confidence level*. Predicted data always
   looks different from logged data: it is **hatched, never solid**. Say what an estimate is based on. The wow must never
   make a guess look like a fact.
3. **Logging takes seconds.** One tap per item, no forms, autosave. "Log" is always one tap away.
4. **Private by default, and visibly so.** Say where data lives. Make no third-party requests (self-host fonts and icons, use no trackers).
5. **Calm, never alarming.** No red alerts for normal variation, no streaks, no guilt.
6. **Accessible always.** WCAG 2.2 AA. Color is never the only signal. Support reduced motion and reduced transparency.
7. **One system, two platforms.** The same tokens, components, words and icons. Only navigation and native behaviors differ (§10).

---

## 2. Materials: glass

### Glass (cards and controls)
| Token / class | Use |
|---|---|
| `.glass` / `.card` → `color-glass` + `blur(28px) saturate(180%)` | Content cards and the sidebar |
| `.glass-strong` → `color-glass-strong` + `blur(40px)` | Controls over busy content: the tab bar, the active nav pill, today's cell, popovers and sheets |
| `color-glass-stroke` | 1px light line on every glass edge |
| `color-glass-sheen` | Inner top highlight (`inset 0 1px 0`) plus the pointer-following specular highlight |
| `color-glass-fill` | Wells, chips, inputs and tracks inside glass |

Rules:
- **Never stack glass on glass on glass.** At most two levels: a card plus a well or chip inside it.
- Text on glass always uses `text` / `text-muted`. Never put colored text on glass except `-ink` tokens on their `-soft` background.
- The background is plain `bg` (`#F2F2F7` light, pure black dark). Glass shows its depth where controls float over scrolling content.
- Fallbacks are built in: without `backdrop-filter`, or with *reduced transparency*, glass becomes a solid `surface`.

---

## 3. Color

All colors are semantic tokens. **Never hard-code a hex value in product code.** Use
`var(--color-*)` on web or `colors[scheme].*` on mobile. Light and dark mode are both first-class. Dark mode is where
Nira looks most dramatic.

### Neutrals (Apple-like)
| Token | Light | Dark |
|---|---|---|
| `bg` | `#F5F5F7` | `#050507` |
| `surface` / `surface-raised` | `#FFFFFF` / `#FFFFFF` | `#1C1C1E` / `#2C2C2E` |
| `text` | `#1D1D1F` | `#F5F5F7` |
| `text-muted` / `text-subtle` | `#636368` / `#6E6E73` | `#A1A1A6` / `#8E8E93` |
| `border-strong` | `#C7C7CC` | `#48484A` |

### Action colors
- **`primary` is ink** (near-black in light mode, near-white in dark mode). Use it for selected chips, user chat bubbles and secondary solid buttons.
- **Pink is the only accent color.** `accent-fill` (`#E0185C`, white text) is used for **`.btn-brand`, at most one per screen**.
  Usually that's the "Log today" CTA. On Ask Nira it's the send button, so the header drops "Log today". In setup, it's "Continue".
  The tab bar's center Log button is navigation and doesn't count. `accent` (`#E0185C` light / `#FF5C8A` dark) is for
  pink text and lines: the logo dot, the active tab, average lines and the focus ring.
- Everything else is black, white, gray and glass.
- Status colors: `success`, `warning` and `danger`, each with a `-soft` version. Use `danger` only for destructive actions or errors, **never for cycle data**.

### Cycle phase colors (pink and neutrals only)
Each phase has a **fill** (arcs, bars, dots), a **`-soft`** tint (badge backgrounds) and an **`-ink`** color (text on `-soft`, contrast-checked).
Phases are told apart by **lightness and labels**, not by a rainbow of hues.

| Phase | Light fill | Dark fill | Meaning |
|---|---|---|---|
| `menstrual` | `#FF2D55` pink | `#FF375F` | Period days |
| `follicular` | `#C7C7CC` light gray | `#636366` | After the period |
| `fertile` | `#FFA3B8` soft pink | `#FFB3C4` | Fertile window, including estimated ovulation |
| `luteal` | `#1D1D1F` ink | `#F5F5F7` | After ovulation |

- The order is always menstrual, follicular, fertile, luteal.
- Fills are graphics, not text, and always come with a text label or legend. Text must use `-ink` tokens.
- No glows or shadows on data marks.

### AI
Nira's assistant is neutral, not "magic". Its answers sit in a gray `ai-soft` bubble (like iMessage), and its icon is
`sparkles` in a black circle (white in dark mode). There are no rainbow borders, orbs or shimmer.

---

## 4. Typography

Follow Apple's typography principles: system fonts, a clear hierarchy, and no light weights.

| Platform | Font |
|---|---|
| Apple devices (web and iOS) | **SF Pro** via the system font (`-apple-system`, or `System` in React Native). Never bundle SF Pro; its license forbids that. |
| Everywhere else (web on Windows, Android, Linux) | **Inter** (SIL OFL), **self-hosted** or bundled |
| Numbers that are the hero | **SF Pro Rounded** via `ui-rounded`, falling back to Inter Display |

The type ramp follows the iOS default "Large" sizes:

| Token | Size / line | Weight | Use |
|---|---|---|---|
| `hero` | 96 / 96, rounded, −4.5% | Bold | One number per screen (cycle day) |
| `display` | 48 / 52, −3.5% | Bold | The key prediction ("Nov 18 – 22") |
| `large-title` | 34 / 41 | Bold | Page title ("Today") |
| `title-1` / `title-2` / `title-3` | 28 / 22 / 20 | Bold / Bold / Semibold | Section heroes, stat values, sheet titles |
| `headline` | 17 / 22 | Semibold | Card titles, fact values |
| `body` | 17 / 24 | Regular | Default text and AI answers |
| `callout` / `subhead` | 16 / 15 | Regular | Nav items, chips, buttons, row labels |
| `footnote` / `caption` | 13 / 12 | Regular / Medium | Meta text, disclaimers, axis labels |
| `overline` | 12, +6%, uppercase | Semibold | Small section labels ("NEXT PERIOD") |

Rules: avoid Light, Thin and Ultralight weights. Use tight negative tracking on big sizes. Use **tabular numbers** for any number that changes or aligns.
Use sentence case everywhere. On mobile, support Dynamic Type and font scaling up to 200%.

---

## 5. Shape, space and depth

- **Spacing:** 4-pt grid (`space-1`=4 … `space-20`=80). Cards are padded 28 (32 for the hero, 20 on phones). The grid gap is 20 (16 on phones).
- **Radius:** `xs` 8 · `sm` 12 · `md` 18 (wells, inputs, day cells) · `lg` 28 (cards, sidebar) · `xl` 36 (sheets) · `pill`.
  **Concentricity:** nested corners should equal the parent radius minus the inset (Apple's rule). Buttons, chips,
  badges, segmented controls, nav items and the tab bar are **always pill-shaped**.
- **Elevation:** soft, wide, neutral shadows (`elevation-1/2/3`). Glass edges get a hairline plus a sheen.
- **Touch targets:** at least 44×44pt (48dp on Android).

---

## 6. Iconography

- **Lucide** (ISC license; `lucide-react` / `lucide-react-native`) at a **2px stroke**, which matches the weight of SF Symbols Regular. Use `currentColor`.
  On a native iOS build, SF Symbols may replace Lucide one-for-one.
- Sizes: 16 inline, 20 default, 24 for the tab bar and primary actions.

| Concept | Icon | Concept | Icon |
|---|---|---|---|
| Today | `sun` | Flow | `droplet` |
| Calendar | `calendar` | Symptoms | `activity` |
| Insights | `chart-line` | Mood | `smile` |
| Ask Nira | `sparkles` (in a black circle) | Note | `sticky-note` |
| Settings | `sliders-horizontal` | Privacy | `lock` |
| Log | `plus` | Pattern | `repeat` |

**Brand mark:** an open ring in ink (black, or white in dark mode) with a pink dot. The wordmark is lowercase **nira** in bold display type with tight tracking.

---

## 7. Components

The web versions are in `web/components.css`. Mobile mirrors the same anatomy and states with `mobile/tokens.ts`.

| Component | Rules |
|---|---|
| **Card** (`.card`) | Glass, `radius-lg`, padding 28, pointer-following sheen on hover. The header has a `headline` title on the left and an optional `card-link` ("Calendar ›") on the right. |
| **Well** (`.well`) | `glass-fill` with `radius-md`, used inside cards for facts and info boxes. |
| **Button** | `.btn-brand` (solid pink, one per screen), `.btn-primary` (ink), `.btn-glass`, `.btn-ghost`, `.btn-danger`. Pill-shaped, 44 tall, semibold `subhead`. Press scales to 0.96 with a spring. |
| **Icon button** | 44px circle. Add `.glass` when it floats in a header. Always give it an accessible label. |
| **Chip** | Multi-select toggle. Unselected: `glass-fill`. Selected: ink with a shadow. "More" is outlined. Use `aria-pressed`. |
| **Segmented control** | Single choice from 2–5 options. The track is `glass-fill`; the selected segment is a raised white (or dark) pill. Use `role="radio"`. |
| **Badge** | Pill with a dot. Phase badges use `-soft` with `-ink`. `badge-plain` has no dot (meta text such as "Based on 6 cycles"). |
| **Confidence meter** | Three bars plus a label. **Every prediction must show one.** |
| **Cycle ring** | Rounded arcs, one per run of days in the same phase and status. Actual days are solid; predicted days are hatched. Dots mark each day. A raised ink knob (black, or white in dark mode) with a pulse marks today. The center shows a `hero` number and a phase badge. |
| **Day cell** | Day of week, rounded date, a phase bar (solid, or hatched if predicted) and log dots. Today is a `glass-strong` raised tile. |
| **Chart bar** | Rounded top, value written inside, latest bar in ink, average shown as a dashed pink line behind the bars. Bars grow in with a spring. |
| **Chat** | User: ink bubble on the right, tail bottom-right. Nira: `ai-soft` bubble on the left, tail bottom-left, with a source badge. The composer is a pill with a pink send button. |
| **Save status** | "Saving…" then "✓ Saved" in the card header. There is never a submit button for logging. |
| **Switch** (`.switch`) | An on/off setting (`<input type="checkbox" class="switch">`). It is pink when on. The whole row is the label. |
| **Grouped list** (`.card.card-flush` + `.list-row`) | Settings and menus. Each row has a 30px `.list-icon`, a `.list-label` (with optional `<small>` helper text), and a `.list-value` with a chevron or a switch. Section titles use `.list-title` above the card. Destructive rows use `.list-row-danger`, alone in their own group at the end. |
| **Step dots** (`.steps`) | Onboarding progress. Done steps are ink, the current step is a wide pink pill, and the rest are gray. |
| **Bottom sheet** (`.sheet` + `.sheet-grabber` + `.sheet-header`) | Mobile logging and pickers. Glass-strong, floating 8pt from the screen edges with corners concentric to the device. "Done" (glass button) closes it, and it autosaves. |
| **Scroll-edge fade** | On mobile, content fades into `bg` under the floating tab bar. It is a plain fade to the background color, not a decorative gradient. |

### States
- Hover (web): one step lighter or more opaque, or the sheen appears. Press: spring scale (0.92–0.96).
- Focus: a 3px `focus` ring, **never removed**.
- Disabled: 40% opacity. Loading: shimmering skeletons in `glass-fill`, not spinners, for content.
- Empty: one sentence plus one action ("No cycles yet. Log your last period to get predictions.").

---

## 8. Data and prediction patterns

1. **Actual data is solid. Predicted data is hatched.** This applies everywhere. On web, add `.is-predicted`.
2. Show **predictions as ranges**: "Nov 18 – 22", then "Most likely Fri, Nov 20", then the confidence meter.
3. **Label estimates** ("Fertile · est.", "Ovulation (est.)") and show the caveat wherever fertility appears:
   *"Calendar-based estimate, not birth control."*
4. **Show your work:** "Based on 6 logged cycles", plus a "Why this estimate?" link.
5. Charts are quiet: no gridlines, values written on the marks, and color reserved for the latest value and the average.

---

## 9. Motion

| Token | ms | Use |
|---|---|---|
| `instant` | 90 | Press feedback |
| `fast` | 160 | Hover, color, toggles |
| `base` | 280 | Buttons (spring), popovers |
| `slow` | 520 | Card entrance (`.rise`), ring arcs, chart bars |

- **Use springs, not linear motion.** Web uses `--ease-spring` (`cubic-bezier(0.34, 1.4, 0.64, 1)`). Mobile uses Reanimated
  `withSpring(spring)` (damping 18, stiffness 220).
- **Choreography on load:** cards rise in staggered by 70ms, ring arcs fade in one after another, the cycle-day number counts up,
  and chart bars grow. Each runs once and lasts under one second.
- The only looping animation is the gentle pulse on the today knob.
- **Reduced motion:** every duration becomes 0 and the pulse stops. This is handled in `tokens.css` and must be handled on mobile too.

---

## 10. Platforms

### Web app
- **≥ 900px:** a **floating glass sidebar** (inset 12px, `radius-lg`) with the logo, pill nav (`1–4` shortcuts) and a privacy
  well at the bottom, next to the content column (max 1200px). The header has an overline date, a `large-title`, and on the right
  glass icon buttons plus a **pink "Log today"** button.
- **< 900px:** the sidebar is hidden and a **floating glass tab bar** appears, a pill inset 12px from the edges, exactly like the mobile app.
  The header Log button is hidden because the tab bar owns "Log".
- Content grid: 12 columns. The hero spans 12; secondary rows split 5 + 7. Below 1200px everything stacks to 12.
- Keyboard: `L` = log, `1–4` = navigation, `/` = Ask Nira, `Esc` closes overlays.

### Mobile app (React Native / Expo recommended)
- **Floating glass tab bar:** Today · Calendar · **[ + ]** (a solid pink circle in the center) · Insights · Ask.
  On iOS 26 and later, use the native Liquid Glass tab bar and toolbars. Elsewhere, use `expo-blur` with `glass-strong`.
- **Large titles** that collapse into an inline title on scroll, as in standard iOS navigation.
- **Logging is a glass bottom sheet** (floating 8pt from the edges, corners concentric with the device, a grabber, detents at medium and large) with Flow, Symptoms,
  Mood and Note. It autosaves and closes with a swipe down.
- The Today screen order is: hero ring card (ring plus next period), This week, Today's log, Ask Nira teaser. See `mobile/today.html`.
- Screen padding is 16, card gap 16, card padding 20. Body text is 17 (iOS default).
- **Haptics:** light impact on chip toggles and saves, selection feedback on segmented controls, and success feedback when a period is logged.
- **Native conventions win** for system UI: navigation gestures, date pickers, share sheets, permissions and Android back.
- Privacy: an app lock (Face ID / biometrics) is offered during onboarding, and the app content is blurred in the app switcher.

---

## 11. Voice and content

- Plain and direct: "Your period is likely to start Nov 18–22", not "Aunt Flo is visiting soon! 🌸".
- Use correct words (period, ovulation, discharge). Be inclusive: write to "you" and assume no gender, partner or goal.
- Be honest about uncertainty ("likely", "estimated", "based on 6 cycles"). Never write "guaranteed" or "safe days".
- The AI explains and never diagnoses. Escalation sounds like: "If this keeps happening, it's worth raising with a clinician."
- No guilt and no streaks. Use sentence case, contractions, no exclamation marks and no emoji in UI chrome.

---

## 12. Accessibility checklist (every screen)

- [ ] Text contrast is at least 4.5:1 (tokens are checked by the build). Never put colored text on glass except `-ink` on `-soft`.
- [ ] Everything is keyboard reachable, with a visible focus ring.
- [ ] Charts and the ring have a text alternative (`role="img"` plus `aria-label`).
- [ ] Phase is never conveyed by color alone.
- [ ] Touch targets are at least 44pt (48dp on Android).
- [ ] Layouts work at 200% text size and 320px width with no horizontal scroll.
- [ ] Reduced motion and reduced transparency are respected (glass becomes solid).

---

## 13. Changing the system

1. Edit `tokens/tokens.json`, never the generated files.
2. Run `node design/scripts/build-tokens.mjs`. All contrast checks must pass.
3. Put reusable patterns in `web/components.css` and document them in §7.
4. Bump the version here and in `tokens.json` for breaking changes, and refresh the screenshots.


---

## 14. Screen inventory (reference designs)

Each screen is a static HTML mockup built only from tokens and components. **New screens must look like they belong
next to these.** Open any file directly in a browser, and add `?theme=dark` to preview dark mode.

| Screen | File | Shows |
|---|---|---|
| Today | [`webapp/today.html`](webapp/today.html) | Cycle ring hero, quick log (autosave), week strip, cycle-length chart, Ask Nira teaser |
| Calendar | [`webapp/calendar.html`](webapp/calendar.html) | Month grid (logged period solid, predicted period hatched, fertile window as a soft ring), selected day details, "Coming up" predictions |
| Insights | [`webapp/insights.html`](webapp/insights.html) | Key numbers, cycle history timeline, symptoms-by-cycle-day heatmap, patterns, prediction accuracy |
| Ask Nira | [`webapp/ask.html`](webapp/ask.html) | Conversation list, chat thread with an inline data card and sources, typing state, suggestions, composer |
| Settings | [`webapp/settings.html`](webapp/settings.html) | Grouped lists, switches, theme picker, privacy controls, delete all data |
| Setup (step 2 of 4) | [`webapp/onboarding.html`](webapp/onboarding.html) | Full-screen flow without the sidebar: step dots, one question per step, date picker, Back / Not sure / Continue |
| Mobile app | [`mobile/today.html`](mobile/today.html) | iPhone screens: Today, the Log bottom sheet, and Ask Nira, with the floating glass tab bar |

**Shared shell:** every web screen loads `webapp/shared.js`, which injects the icon sprite, fills `<aside data-sidebar>`,
`<nav data-tabbar>` and `<div data-actions>` (use `data-actions="no-log"` when the screen has another pink action), and provides
`Nira.renderRing()`, the sample cycle data, the theme toggle and chip and segmented behavior. Set `<body data-page="…">` to mark the current nav item.

**Still to design** (follow the same patterns): first-launch welcome (step 1), app lock screen, period start/end editing, the
"Why this estimate?" explainer, the export flow, and empty states for each screen.

*Inspired by Apple's Human Interface Guidelines and Liquid Glass. It does not copy Apple's
branding or assets, and SF fonts are only used through the system font on Apple devices.*

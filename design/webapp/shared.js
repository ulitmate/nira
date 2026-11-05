/* Nira web mockups — shared shell (v3).
 * Loaded at the end of <body> on every screen, BEFORE the page's own script.
 *   - Injects the Lucide icon sprite:  <svg class="icon"><use href="#i-calendar"/></svg>
 *   - Fills <aside data-sidebar>, <nav data-tabbar> and <div data-actions> (set <body data-page="today|calendar|…">)
 *   - Exposes window.Nira: sample cycle data, phaseOf(), renderRing(el)
 *   - Generic behavior: theme toggle (+ ?theme=dark), chip toggles, segmented controls, glass sheen
 * Sample data is fictional. In the real app this file becomes shared React components.
 */
(function () {
  "use strict";

  // ---------- Icons (Lucide, ISC license) ----------
  const ICONS = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    settings: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    note: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "test-tube": '<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    compose: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>',
  };
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICONS)
    .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("")}
    <symbol id="nira-mark" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="none" stroke="var(--color-text)" stroke-width="4" stroke-dasharray="54 15.1" stroke-linecap="round" transform="rotate(-62 16 16)"/><circle cx="23.6" cy="7.4" r="3.6" fill="var(--color-accent)"/></symbol></svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);
  const icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  // ---------- Navigation ----------
  const page = document.body.dataset.page;
  const NAV = [
    { id: "today", label: "Today", href: "today.html", icon: "today", key: "1" },
    { id: "calendar", label: "Calendar", href: "calendar.html", icon: "calendar", key: "2" },
    { id: "insights", label: "Insights", href: "insights.html", icon: "chart", key: "3" },
    { id: "ask", label: "Ask Nira", short: "Ask", href: "ask.html", icon: "sparkles", key: "4" },
    { id: "settings", label: "Settings", href: "settings.html", icon: "settings" },
  ];
  const current = (id) => (id === page ? 'aria-current="page"' : "");

  const sidebar = document.querySelector("[data-sidebar]");
  if (sidebar) sidebar.innerHTML = `
    <a class="brand" href="today.html"><svg class="brand-mark"><use href="#nira-mark"/></svg><span class="brand-word">nira</span></a>
    <nav class="nav">${NAV.map(n => `<a class="nav-item" href="${n.href}" ${current(n.id)}>${icon(n.icon)}${n.label}${n.key ? `<span class="kbd">${n.key}</span>` : ""}</a>`).join("")}</nav>
    <div class="sidebar-footer"><div class="well privacy" style="display:grid;gap:var(--space-2)">
      <div class="t-subhead" style="display:flex;align-items:center;gap:var(--space-2);font-weight:600">${icon("lock", "icon-sm").replace('class="icon', 'style="color:var(--color-success)" class="icon')}Private by design</div>
      <p class="t-footnote text-muted">Stored on this device and encrypted. No ads. Your data is never sold.</p>
    </div></div>`;

  const tabbar = document.querySelector("[data-tabbar]");
  if (tabbar) {
    const tab = (n) => `<a class="tab" href="${n.href}" ${current(n.id)}>${icon(n.icon, "icon-lg")}${n.short || n.label}</a>`;
    tabbar.innerHTML = tab(NAV[0]) + tab(NAV[1]) +
      `<a class="tab-log btn btn-brand" href="#" aria-label="Log today">${icon("plus", "icon-lg")}</a>` + tab(NAV[2]) + tab(NAV[3]);
  }

  // Header actions: search, theme, and the screen's single pink CTA (omit with data-actions="no-log")
  document.querySelectorAll("[data-actions]").forEach(el => {
    el.innerHTML = `<button class="icon-btn glass" aria-label="Search">${icon("search")}</button>
      <button class="icon-btn glass" aria-label="Toggle dark mode" data-theme-toggle>${icon("moon")}</button>` +
      (el.dataset.actions === "no-log" ? "" : `<button class="btn btn-brand">${icon("plus", "icon-sm")}Log today<span class="kbd">L</span></button>`);
  });

  // ---------- Sample cycle data (fictional) ----------
  const cycle = {
    start: new Date(2026, 9, 23), // Oct 23 2026 = cycle day 1
    length: 28, today: 14, periodLength: 5,
    history: [ // previous cycles, oldest first: [start label, length]
      ["May 3", 27], ["May 30", 29], ["Jun 28", 28], ["Jul 26", 31], ["Aug 26", 26], ["Sep 24", 29],
    ],
  };
  const phaseOf = (d) => (d <= 5 ? "menstrual" : d <= 9 ? "follicular" : d <= 15 ? "fertile" : "luteal");

  // ---------- Cycle ring (shared by web + mobile mockups) ----------
  // Geometry is fixed in a 320×320 viewBox; size it with CSS. Actual days = solid arcs.
  // Future days = hatched (predicted). Dots mark each day. An ink knob marks today.
  function renderRing(el, opts = {}) {
    const len = opts.length || cycle.length, today = opts.today || cycle.today, uid = Math.random().toString(36).slice(2, 7);
    const S = 320, c = S / 2, r = 134, sw = 22, gapDeg = 3, step = 360 / len, capDeg = (sw / 2) / r * 180 / Math.PI;
    const pt = (deg, rad) => { const a = (deg - 90) * Math.PI / 180; return [c + rad * Math.cos(a), c + rad * Math.sin(a)]; };
    const arc = (a0, a1) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
    const runs = [];
    for (let d = 1; d <= len; d++) {
      const predicted = d > today, key = phaseOf(d) + predicted, last = runs[runs.length - 1];
      if (last && last.key === key) last.end = d; else runs.push({ key, phase: phaseOf(d), predicted, start: d, end: d });
    }
    const phases = ["menstrual", "follicular", "fertile", "luteal"];
    const defs = `<filter id="ks-${uid}" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25"/></filter>` +
      phases.map(p => `<pattern id="h-${p}-${uid}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--color-phase-${p})" fill-opacity="0.16"/><rect width="2.2" height="6" fill="var(--color-phase-${p})" fill-opacity="0.75"/></pattern>`).join("");
    let arcs = "";
    runs.forEach((run, i) => {
      let a0 = (run.start - 1) * step + gapDeg / 2 + capDeg, a1 = run.end * step - gapDeg / 2 - capDeg;
      if (a1 < a0) a0 = a1 = (a0 + a1) / 2;
      const d = a1 > a0 ? arc(a0, a1) : (() => { const [x, y] = pt(a0, r); return `M${x} ${y} l0.01 0`; })();
      arcs += `<path class="arc" style="--i:${i}" d="${d}" stroke="${run.predicted ? `url(#h-${run.phase}-${uid})` : `var(--color-phase-${run.phase})`}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
    });
    let ticks = "";
    for (let d = 1; d <= len; d++) {
      if (d === today) continue;
      const [x, y] = pt((d - 0.5) * step, r - sw / 2 - 12);
      ticks += `<circle cx="${x}" cy="${y}" r="1.6" fill="var(--color-text-subtle)" opacity="${d > today ? 0.35 : 0.6}"/>`;
    }
    const [kx, ky] = pt((today - 0.5) * step, r), p = phaseOf(today);
    const knob = `<circle class="knob-pulse" cx="${kx}" cy="${ky}" r="16" fill="none" stroke="var(--color-phase-${p})" stroke-width="2"/>
      <circle cx="${kx}" cy="${ky}" r="17" fill="var(--color-primary)" filter="url(#ks-${uid})"/><circle cx="${kx}" cy="${ky}" r="7" fill="var(--color-phase-${p})"/>`;
    el.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 ${S} ${S}" aria-hidden="true" style="width:100%;height:100%;overflow:visible"><defs>${defs}</defs>
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--color-glass-fill)" stroke-width="${sw}"/>${arcs}${ticks}${knob}</svg>`);
  }

  // ---------- Generic behavior ----------
  const forced = new URLSearchParams(location.search).get("theme");
  if (forced) document.documentElement.dataset.theme = forced;
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme-toggle]");
    if (t) {
      const root = document.documentElement;
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
    }
    const chip = e.target.closest(".chip[aria-pressed]");
    if (chip) chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") !== "true");
    const seg = e.target.closest(".segmented button");
    if (seg) seg.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", b === seg));
  });
  document.querySelectorAll(".card").forEach(card => card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`); card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  window.Nira = { cycle, phaseOf, renderRing, icon, reduceMotion: matchMedia("(prefers-reduced-motion: reduce)").matches };
})();

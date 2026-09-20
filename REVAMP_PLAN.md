# Revamp Plan — benjieDev Portfolio & Admin Console

> Status: Approved for execution (checkpoints enabled)
> Source of truth: `benjiedev_project_brief_prd.md` (target design) + `UISPECS.md` §5 (fix list)
> Token reference: `DESIGN.md` · Conventions: `AGENTS.md` · Content: `DETAILS.md`
> Last updated: 2026-09-17

## 0. How to resume in a new session

Paste this to the next agent:

> Read `REVAMP_PLAN.md`, `AGENTS.md`, `DESIGN.md`, `UISPECS.md`, and
> `benjiedev_project_brief_prd.md`. Execute the next unchecked phase. Stop at each
> "CHECKPOINT" and report before continuing.

Progress is tracked by ticking the phase checkboxes below. Do not start a phase until
the previous checkpoint is signed off.

## 1. Scope & decisions

- **Scope:** Full PRD — public pages, admin console, real light mode + toggle,
  slide-over CRUD form, backend view tracking.
- **Simulated telemetry** (terminal `$uptime`, bento "response" badges, chart trend) is
  console-flavored and deterministic, framed as terminal aesthetic — NOT presented as
  measured analytics. Real per-project view counts ARE real (Phase 3).
- **Theme:** system preference default, persisted to localStorage; toggle in Navbar.
- **`AdminSettings`** stays a dashboard tab (matches PRD route map), not a route.
- **Markdown styling:** hand-written token CSS. **No new dependencies.**
- **Go:** public copy may describe Go *skills* (accurate to `DETAILS.md`); do NOT claim a
  Go backend service (API is Express-only).
- **Delivery:** phase-by-phase with review checkpoints after each phase.

## 2. Current-state findings that shape the work

- `DESIGN.md` tokens already match PRD §6; the gap is **experience + debt**, not palette.
- Nothing consumes `useTheme`; `@theme` is static dark. Light mode requires a
  `@theme inline` + CSS-variable switch, not `dark:` prefixes everywhere.
- Glass utilities hardcode `bg-black/40` / `hover:bg-white/5` → break in light mode;
  must become token-driven.
- Legacy CSS (`ProjectDetail.css`, `AdminSettings.css`, `AdminDashboard.css`) uses generic
  `--text-primary` vars and redefines `.btn-primary`, colliding with the design system.
  `AdminLogin.css` is orphaned; `AdminSettings.css` imported twice;
  `rim-light`/`custom-scrollbar` undefined.
- Footer duplicated 3× with inconsistent branding; no shared primitives.
- Admin sidebar `fixed w-64 ml-64` is broken on mobile. No 404. Fake metrics.
  Inert `Support` + visibility buttons.
- Backend tests mock Mongoose statics (`tests/api.test.js`), so a view endpoint using
  `Project.findByIdAndUpdate` is testable without Mongo.

## 3. Verification commands (run at every checkpoint)

- Frontend: `npm run lint` and `npm run build` (in `frontend/`)
- Backend: `npm run lint` and `npm test` (in `backend/`)
- Manual smoke: public pages, terminal, theme toggle, admin login → CRUD → visibility →
  settings. Backend needs a reachable `MONGODB_URI` for manual admin testing.

---

## Phase 1 — Foundation (theme + shared components + routing)

- [ ] **1.1 `index.css` rewrite**
  - Semantic vars in `:root` (light) and `.dark` (dark); `@theme inline { --color-surface: var(--surface); … }`.
  - Add `@custom-variant dark (&:where(.dark, .dark *))`.
  - Token-drive `glass-card`/`glass-panel` (`bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30`).
  - Consolidate duplicate `.glass-panel`; remove generic `--text-primary` block once legacy CSS is gone.
  - Add `markdown-body` styles, `custom-scrollbar`, `rim-light` (or drop), status-pulse +
    terminal-cursor keyframes, `:focus-visible` ring, `prefers-reduced-motion` guard.
- [ ] **1.2 Light palette** — near-white green-tinted surfaces, `primary #0f9d6b` for
  contrast, dark green on-surface, white `on-primary`. Verify AA on buttons/pills.
- [ ] **1.3 `index.html`** — inline pre-paint theme script (no FOUC) + meta description.
- [ ] **1.4 Primitives** — `Container`, `Section`, `SectionHeading`, `Button`
  (primary/secondary/ghost × sm/md/lg), `Card`, `StatusBadge`, `StatCard`.
- [ ] **1.5 Shell** — `Navbar` (theme toggle + discrete admin lock → `/admin/login` or
  dashboard when authed; mobile drawer retained), `Footer` (single source, fixes branding),
  `Layout`, `ScrollToTop`.
- [ ] **1.6 Routing (`App.jsx`)** — public routes wrapped in `Layout`; add `*` → `NotFound`;
  admin outside public shell.
- [ ] **1.7 Data/lib** — centralize profile links, tech stack, stats, terminal commands,
  deterministic telemetry helper.

**Accept:** lint + build pass; pages render in shared shell; theme toggles with no FOUC.

> **CHECKPOINT 1** — Report: files created/changed, screenshot/summary of dark+light shell,
> lint/build output. Wait for sign-off.

---

## Phase 2 — Public pages

- [ ] **2.1 Home:** Hero (status badge, gradient accent subtitle, CTAs, emerald glow) →
  Quick Metrics (iconed, animated counters) → Core Tooling (6 cards) → **Featured Systems
  bento** (CareFacility/LandLedger/Kijiji, console-style status/telemetry) → **Interactive
  Terminal** (macros `$help $projects $stack $uptime $contact` + typed input, `role="log"`,
  reduced-motion safe, real data from `DETAILS.md`) → Final CTA. Replace raw `<a href>` with
  `<Link>`/`Button`.
- [ ] **2.2 Projects:** extract `ProjectCard` (thumbnail, category pill, tech pills,
  Code/Demo links, console latency tag); skeleton loading; keep 4-project fallback; filter
  tabs preserved.
- [ ] **2.3 ProjectDetail:** rebuild on tokens, drop legacy CSS; metadata bar with Material
  Symbols (no emoji); `MarkdownContent`; skeleton + not-found states; fire view-count
  endpoint once (StrictMode guard).
- [ ] **2.4 About:** data-driven timeline + 4-pillar skill grid; shared Contact panel +
  `Footer`; keep split hero and `.text-gradient`.
- [ ] **2.5 Delete `styles/ProjectDetail.css`.**

**Accept:** no legacy classes on public pages; responsive + keyboard nav; lint/build.

> **CHECKPOINT 2** — Report: each page (mobile + desktop, dark + light), terminal behavior,
> lint/build. Wait for sign-off.

---

## Phase 3 — Backend view tracking

- [ ] **3.1 `models/Project.js`:** add `views: { type: Number, default: 0 }`.
- [ ] **3.2 `index.js`:** `POST /api/projects/:id/view` (public) → `$inc` views, return
  `{ views }`; lenient rate limit; malformed ObjectId → 400 (not 500).
- [ ] **3.3 `tests/api.test.js`:** increments, 404 when missing, no auth required, invalid id
  degrades gracefully.
- [ ] **3.4 README endpoint table update.**

**Accept:** backend `npm run lint` + `npm test` green.

> **CHECKPOINT 3** — Report: test output, endpoint contract. Wait for sign-off.

---

## Phase 4 — Admin console

- [ ] **4.1 Auth:** `AuthContext` + `ProtectedRoute`; axios response interceptor logs out +
  redirects on 401 (excluding `/admin/login`).
- [ ] **4.2 Shell:** `AdminLayout`/`Sidebar` responsive (drawer on mobile), session badge +
  instant logout; wire `Support` to mailto.
- [ ] **4.3 Login:** token UI retained; fix `<a href>` → `<Link>`.
- [ ] **4.4 Dashboard:** replace fake metrics with real totals, published/draft, summed
  views, last updated; `TelemetryChart` (inline SVG: views-per-project bars + throughput
  trend) from real data.
- [ ] **4.5 Projects:** `ProjectsTable` with functional **visibility toggle** (existing
  `PUT /projects/:id`) + confirm-delete; **`ProjectFormDrawer`** slide-over (title, slug,
  category, tech/tags pills, readTime, status, markdown body + preview), focus trap,
  Esc/backdrop close.
- [ ] **4.6 Settings:** token restyle; remove double import; add read-only **Raw Config**
  viewer (derived values only — no `JWT_SECRET`/`MONGODB_URI`) + simulated SSH key status;
  keep credential form.
- [ ] **4.7 Delete `styles/AdminDashboard.css` and `styles/AdminSettings.css`.**

**Accept:** CRUD + visibility + settings work against API; mobile admin usable; lint/build.

> **CHECKPOINT 4** — Report: admin flows (login, create/edit/delete, visibility toggle,
> settings, config view), mobile sidebar, lint/build. Wait for sign-off.

---

## Phase 5 — Docs sync + QA

- [ ] **5.1** Update `UISPECS.md` (new as-built), `DESIGN.md` (light tokens, theme
  mechanism, motion, markdown, components), `AGENTS.md` (new dirs/components/context),
  `README.md`.
- [ ] **5.2** Final gate: frontend lint + build; backend lint + test; manual smoke;
  reduced-motion + focus audit; Lighthouse spot-check (target ≥95 desktop).

**Accept:** docs match code; all gates green.

> **CHECKPOINT 5 (final)** — Report: full verification results + known follow-ups.

---

## 4. File inventory

### New — frontend components
`Layout`, `Container`, `Section`, `SectionHeading`, `Button`, `Card`, `StatusBadge`,
`StatCard`, `ProjectCard`, `Terminal`, `FeaturedSystems`, `MarkdownContent`, `ThemeToggle`,
`NotFound`, `ProtectedRoute`, `ScrollToTop`
### New — frontend admin components
`admin/AdminLayout`, `admin/Sidebar`, `admin/StatCards`, `admin/TelemetryChart`,
`admin/ProjectsTable`, `admin/ProjectFormDrawer`, `admin/ConfigViewer`, `admin/SessionBadge`
### New — frontend lib/data/context
`data/profile.js`, `data/techStack.js`, `data/stats.js`, `data/terminalCommands.js`,
`lib/telemetry.js`, `context/AuthContext.jsx` (+ `context/authContext.js`)
### Modified — frontend
`App.jsx`, `index.css`, `index.html`, `pages/Home.jsx`, `pages/Projects.jsx`,
`pages/ProjectDetail.jsx`, `pages/About.jsx`, `pages/AdminLogin.jsx`,
`pages/AdminDashboard.jsx`, `pages/AdminSettings.jsx`, `utils/api.js`
### Deleted — frontend
`styles/ProjectDetail.css`, `styles/AdminSettings.css`, `styles/AdminDashboard.css`,
`styles/AdminLogin.css`
### Modified — backend
`models/Project.js`, `index.js`, `tests/api.test.js`
### Modified — docs
`UISPECS.md`, `DESIGN.md`, `AGENTS.md`, `README.md`

## 5. Risks / watch-items

- Light-mode contrast across glass/pills — audit at Phase 1 and Phase 5.
- Axios 401 interceptor must exclude `/admin/login` to avoid redirect loops.
- View endpoint double-count under React StrictMode in dev — guard with a `useRef`.
- Tailwind v4 `@theme inline` + custom dark variant ordering — verify both modes build.
- Removing legacy CSS must fully cover admin before deletion.
- `Project.findById`/`findByIdAndUpdate` can throw CastError on bad ids — handle → 400.
- Raw config viewer must never render env secrets.

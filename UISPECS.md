# UI Specs (As-Built)

Inventory of the user interface: routes, shared components, page sections, naming
conventions, and design tokens. This is the **as-built** reference for the Registry
Office revamp. Update this file whenever pages, sections, or shared components are
added, renamed, or removed. Token definitions live in `@DESIGN.md`.

Status: current as of the Registry Office redesign.

---

## 1. Route & Page Map

Routing is defined in `frontend/src/App.jsx` using React Router. Public pages render
inside `<Layout>` (masthead + `<main>` + document footer); admin routes render inside
`<AdminLayout>` via `<ProtectedRoute>`.

| Path | Page component | File | Access | In Navbar |
|---|---|---|---|---|
| `/` | `Home` | `pages/Home.jsx` | Public | Yes |
| `/projects` | `Projects` | `pages/Projects.jsx` | Public | Yes |
| `/projects/:slug` | `ProjectDetail` | `pages/ProjectDetail.jsx` | Public | No |
| `/about` | `About` | `pages/About.jsx` | Public | Yes |
| `/admin/login` | `AdminLogin` | `pages/AdminLogin.jsx` | Public form | No |
| `/admin/dashboard` | `AdminDashboard` | `pages/AdminDashboard.jsx` | Auth (`ProtectedRoute` + JWT) | No |
| `*` | `NotFound` | `components/layout/NotFound.jsx` | Public | No |

Notes:

- `AdminSettings` is **not routed** — it renders as a tab inside `AdminDashboard`.
- `NotFound` ("Not on record" 404) catches all unmatched paths.
- Public routes with a project detail survive refresh (`ScrollToTop` is scroll-placement only).

---

## 2. Shared Components

Shared primitives live in `frontend/src/components/primitives/`, the public shell in
`frontend/src/components/layout/`.

### 2.1 Layout shell

- `Layout` — sticky masthead (`Navbar`) + `<main>` + document footer (`layout/Footer`).
- `Navbar` — text masthead: name + `BK / 026` monogram, serif nav links (active link =
  underline registry), shared `ThemeToggle`, `Hire Me` mailto button. Mobile: `☰`
  drawer with `aria-expanded`, auto-closes on route change. Top: 3px registry band.
- `Footer` — registry document footer: filing lines, `REC. NO. BK-026`, record index,
  correspondence links. Reads real profile links from `data/profile.js`.
- `ScrollToTop` — restores scroll position on navigation.
- `NotFound` — `NOT ON RECORD` 404, mono error line, "Return to the index" link.

### 2.2 Public primitives

| Component | Notes |
|---|---|
| `Container` | `container-page`: max-width 1240px + 24px gutter |
| `Section` | Vertical rhythm wrapper (96px) |
| `SectionHeading` | Reference line (`file-index-sm`) + serif heading + short rule |
| `Button` | `primary` / `stroke` / `ghost` × `sm` / `md` / `lg`; renders `Link`/`a`/`button` |
| `Card` | Flat framed surface (`card-flat`) |
| `StatusBadge` | Mono bordered tag (status, views, read time) |
| `StatCard` | Ruled fact row: value + mono label |
| `ProjectCard` | Case-file row: `REG. NO.`/`DIVISION`, title, description, tech index, Source/Live/Record links; optional framed photo (`showImage`) |

### 2.3 Admin components

| Component | Notes |
|---|---|
| `admin/AdminLayout` | Console shell: admin masthead + `Sidebar` + content `container-page` |
| `admin/Sidebar` | Controlled (`active` + `onSelect`): Dashboard / Projects / Settings, session stamp, log out |
| `admin/ProjectsTable` | Registry table; edit button; two-step inline delete confirm |
| `admin/ProjectFormDrawer` | Slide-over filing form; state seeded from `initialData`; Esc/backdrop close; `onSaved` callback |
| `admin/TelemetryChart` | Inline SVG — portfolio views per record (horizontal bars from `projects`) |

---

## 3. Page-by-Page Section Inventory

### 3.1 Home — `pages/Home.jsx`

1. Masthead hero — `text-masthead` name, mono intro line, availability stamp,
   `Hire Me` (mailto) + `View my record` (→ `/projects`).
2. Record cells — 4 `StatCard` facts from `data/stats.js` (`8+` shipped, `4+` years,
   `24/7` uptime, monthly views).
3. Production records — first 4 `ProjectCard` rows (fresh from `/api/projects`, fallback
   array on API failure).
4. Technical index — mono table of `data/techStack.js` (field / stack).
5. Correspondence file — contact panel: email, phone, location, social links.

### 3.2 Projects — `pages/Projects.jsx`

- Page masthead (reference `BK / PROD.`, heading, intro line).
- Filter row — `All` + divisions from the fetched/fallback records (mono tab row).
- Case-file index — `ProjectCard` ledger rows for filtered records (skeleton rows while loading).
- Empty state ("No records on file").

### 3.3 ProjectDetail — `pages/ProjectDetail.jsx`

- Back link (`← Back to the index`).
- Filed document: `FILED` line with `BK-XXX` reg no. + `FILE OPEN`/0 views, heading,
  `DIVISION:` metadata, mono date + `StatusBadge`s (views, read time).
- Markdown body via `react-markdown` (`markdown-body` styles: square list markers,
  mono inline code, double-rule blockquotes, hairline tables).
- Technology index + Source/Live/Record buttons.
- Skeleton while loading; "File not on record" state when missing. View count guarded by
  `useRef` to avoid StrictMode double-counting.

### 3.4 About — `pages/About.jsx`

1. Page masthead — portrait as filing photo (mono caption `FILE PHOTO / BK-026`),
   bio paragraphs.
2. Employment ledger — roles from `data/profile.js`; current role marked "CURRENT".
3. Technical index — same table as Home (`data/techStack.js`).
4. Attestation panel — statement + availability stamp.

### 3.5 AdminLogin — `pages/AdminLogin.jsx`

Rendered on `paper` (no public masthead — standalone form office). Back link to `/`.
Form card (`AUTHORISED PERSONNEL ONLY` eyebrow, heading `Registry sign in`,
`Enter your credentials to open the console.`), username + password (`input-base`),
error message, `Sign in` (`btn-primary`). On success stores token in `localStorage`
(`utils/auth.js`) and redirects to `/admin/dashboard`; a shared `auth-unauthorized`
event (via `utils/api.js` 401 interceptor) notifies `AuthContext`.

### 3.6 AdminDashboard — `pages/AdminDashboard.jsx`

Shell: `AdminLayout` + `Sidebar`. Active tab in state (`dashboard` / `projects` / `settings`).

- **Dashboard view** — overview heading, `StatCard`s (total records, portfolio views
  summed from `p.views`, last updated), `TelemetryChart`, and a ledger of record
  divisions/statuses.
- **Projects view** — "File new record" (`btn-primary`) opens `ProjectFormDrawer`; below,
  `ProjectsTable` (title, division, status badge, views, actions). Save flow calls
  `loadProjects` again; inline confirm for delete.
- **Settings view** — renders `AdminSettings`.

### 3.7 AdminSettings — `pages/AdminSettings.jsx`

Self-contained card: **Change username** and **Change password** fields with inline
validation + success/error messages; `Save changes` posts to `/api/admin/settings`.
Below, **Console configuration** — derived live values only (app version, feature toggles,
etc.); secrets (`JWT_SECRET`, `MONGODB_URI`) are never fetched or rendered.

---

## 4. Naming Conventions

- Pages: `pages/PascalCase.jsx`, default export.
- Public shell: `components/layout/*`; primitives: `components/primitives/*`.
- Admin: `components/admin/*`.
- Client API: single shared instance in `utils/api.js` — endpoints are
  `/projects`, `/projects/slug/:slug`, `/public/*`, `/admin/*` (base already includes `/api`).
- Styling: Tailwind utilities from tokens (`bg-paper`, `text-ink-muted`,
  `border-rule-strong`, `text-registry`) plus registry component classes in
  `@layer components` (`btn`, `input-base`, `file-index`, `stamp`, `card-flat`,
  `ledger-row`, `container-page`, `markdown-body`, `animate-rise`).
- Type scale: `text-masthead`, `text-heading-xl`, `text-heading`, `text-title`,
  `text-title-sm`, `text-body`, `text-body-sm`.
- Section names are code comments in public pages (`SECTION 1: MASTHEAD`, ...) and
  tab state in admin. No IDs required.

---

## 5. Revamp Notes

- Distinct light/dark palettes; `@theme inline` maps custom properties to utilities;
  `.dark` override on `<html>`. No FOUC (ThemeContext applies the class before paint).
- Red stamp used once per page (availability): Home masthead + About attestation.
- Legacy removed: `terminalCommands.js`, `lib/telemetry.js`, `src/styles/*`, Material
  Symbols font, `glass-*`, `emerald-glow`, `text-gradient`, `tech-pill` classes.
- Dead/deprecated components removed: `StatCards`, `ConfigViewer`, `SessionBadge`.
- `ProtectedRoute` checks `useAuth().isAuthenticated` and redirects to `/admin/login`.
- `api.js` 401 interceptor emits `auth-unauthorized` (no `window.location.replace` loop).

---

## 6. Cross-References

| Document | Purpose |
|---|---|
| `@DESIGN.md` | Full design system: tokens, type scale, components, accessibility |
| `@AGENTS.md` | Project structure, API conventions, security rules |
| `README.md` | Setup, env vars, endpoints, admin access |
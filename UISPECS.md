# UI Specs (As-Built)

Inventory of the user interface: pages, shared components, sections, naming conventions,
and design tokens. This is the **as-built** reference for the completed UI revamp —
documenting what has been implemented per the PRD and design system.

Status: current as of the completed revamp. Update this file whenever pages,
sections, or shared components are added, renamed, or removed.

---

## 1. Route & Page Map

Routing is defined in `frontend/src/App.jsx` using React Router.

| Path | Page component | File | Access | In Navbar |
|---|---|---|---|---|
| `/` | `Home` | `pages/Home.jsx` | Public | Yes |
| `/projects` | `Projects` | `pages/Projects.jsx` | Public | Yes |
| `/projects/:slug` | `ProjectDetail` | `pages/ProjectDetail.jsx` | Public | No |
| `/about` | `About` | `pages/About.jsx` | Public | Yes |
| `/admin/login` | `AdminLogin` | `pages/AdminLogin.jsx` | Public form | No |
| `/admin/dashboard` | `AdminDashboard` | `pages/AdminDashboard.jsx` | Auth (client-side token check) | No |
| `*` | `NotFound` | `pages/NotFound.jsx` | Public | No |

Notes:

- `AdminSettings` (`pages/AdminSettings.jsx`) is **not routed**. It is rendered as a
  tab inside `AdminDashboard`.
- Theme toggle is available in the Navbar; system preference + localStorage persists
  the choice; `@theme inline` with class-based `.dark` override.
- `NotFound` renders for any unmatched path — catches 404s gracefully.

---

## 2. Shared Components

Shared components live in `frontend/src/components/`. These eliminate the duplication
that existed in the pre-revamp codebase (duplicated footers, scattered button classes,
inconsistent card patterns).

### 2.1 `Layout` — `components/Layout.jsx`

Root layout wrapper used by all pages.

- `<Navbar />` — fixed top, z-50, h-16, glass background
- `<main>` — `pt-32` for public pages (offset for fixed nav)
- `<Footer />` — single source of truth, fixes branding
- Container/Screen padding

### 2.2 `Container` — `components/Container.jsx`

```html
<div className="max-w-container-max mx-auto px-gutter">
```

Used across all pages for consistent max-width + horizontal padding.

### 2.3 `Section` — `components/Section.jsx`

Standard section wrapper with consistent internals:

```html
<section className="py-stack-lg">
  {content}
</section>
```

### 2.4 `SectionHeading` — `components/SectionHeading.jsx`

```html
<h2 className="headline-md font-semibold tracking-tight">
  {children}
</h2>
```

### 2.5 `Button` — `components/Button.jsx`

Primary/secondary/ghost variants in sm/md/lg sizes, token-colored.

| Variant | Class Pattern |
|---|---|
| `primary` | `px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:brightness-110 active:scale-95 transition-all duration-200` |
| `secondary` | `px-6 py-3 border border-outline text-on-surface rounded-lg font-semibold hover:bg-white/5 transition-all duration-200` |
| `ghost` | `px-4 py-2 text-on-surfacerounded-lg font-semibold hover:bg-surface-container-low/5 transition-all duration-200` |

### 2.6 `Card` — `components/Card.jsx`

Glass-morphic card with token-driven styling:

```css
bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-lg
```

Hover: `border-primary shadow-lg -translate-y-1`

### 2.7 `StatusBadge` — `components/StatusBadge.jsx`

Pill-styled status indicator using `tech-pill` pattern with primary border.

### 2.8 `StatCard` — `components/StatCard.jsx`

Card displaying a stat (number + label + icon), token-styled.

### 2.9 `ProjectCard` — `components/ProjectCard.jsx`

Thumbnail, category pill, title, description, tech pills, Code/Demo links, console latency tag.

### 2.10 `Footer` — `components/Footer.jsx`

Single shared footer used across Home, Projects, and About:

```
benjieDev © 2026 All rights reserved. GitHub LinkedIn Dev.to
```

Replaces the three duplicated footer variants from the pre-revamp codebase.

### 2.11 `ScrollToTop` — `components/ScrollToTop.jsx`

### 2.12 `NotFound` — `pages/NotFound.jsx`

404 page rendered for unknown routes.

### 2.13 `AdminLayout` — `components/admin/AdminLayout.jsx`

Admin shell with responsive Sidebar + Main Content Canvas.

### 2.14 `Sidebar` — `components/admin/Sidebar.jsx`

Responsive drawer on mobile; brand header (`B. Koimett` / `Admin Console`);
nav links (Dashboard, Projects, Settings); session badge; Support → mailto; Logout.

### 2.15 `TelemetryChart` — `components/admin/TelemetryChart.jsx`

Inline SVG: views-per-project bars + throughput trend from real data.

### 2.16 `ProjectsTable` — `components/admin/ProjectsTable.jsx`

Functional visibility toggle (PUT /projects/:id) + confirm-delete.

### 2.17 `ProjectFormDrawer` — `components/admin/ProjectFormDrawer.jsx`

Slide-over form (title, slug, category, tech/tags pills, readTime, status, markdown body + preview),
focus trap, Esc/backdrop close.

### 2.18 `ConfigViewer` — `components/admin/ConfigViewer.jsx`

Read-only raw config viewer (derived values only — no JWT_SECRET/MONGODB_URI) +
simulated SSH key status.

### 2.19 `SessionBadge` — `components/admin/SessionBadge.jsx`

Session badge indicating active administrative session with instant logout.

---

## 3. Page-by-Page Section Inventory

Section names are taken from code comments or `id` attributes where present.

### 3.1 Home — `pages/Home.jsx`

Named sections:

1. `SECTION 1: HERO`
2. `SECTION 2: QUICK STATS`
3. `SECTION 3: TECHNICAL STACK`
4. `SECTION 4: FEATURED SYSTEMS BENTO` (built — CareFacility/LandLedger/Kijiji)
5. `SECTION 5: INTERACTIVE TERMINAL` (macros `$help $projects $stack $uptime $contact` +
   typed input, `role="log"`, reduced-motion safe, real data from `DETAILS.md`)
6. `SECTION 6: FINAL CTA`
7. `SECTION 7: FOOTER` (shared `<Footer />`)

Sub-parts:

- **Hero:** Status Badge (`Available Immediately · Remote-Ready`), Headline
  (`Benjamin Kiprotich Koimett`), Subheading, Description, Buttons (`View My Work`,
  `Contact Me`) — all `<Link>`/`Button` components.
- **Quick Stats:** 3 Stat Cards — `8+ Projects Shipped`, `4+ Years Experience`,
  `24/7 Production Uptime`.
- **Technical Stack:** heading `Core Infrastructure & Tooling` + 6 tech cards
  (React, Node.js, MongoDB, TypeScript, Docker, Golang).
- **Featured Systems Bento:** Grid showing top 3 verified deployments with benchmark
  telemetry (response time in ms, status indicators).
- **Interactive Terminal:** Simulated shell environment in `JetBrains Mono` responding
  to macro buttons (`$help`, `$projects`, `$stack`, `$uptime`, `$contact`).
- **Final CTA:** heading `Let's Build Something Great` + buttons
  (`Start a Conversation` → `/about`, `Get In Touch` → mailto).
- **Footer:** shared `<Footer />` component with brand + copyright + `GitHub`
  / `LinkedIn` / `Dev.to`.

ASCII wireframe (excerpt):

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

· · · · · · emerald glow (absolute) · · · · · ·

┌────────────────────────────────────┐
│ ⌨ Available Immediately · Remote-Ready │   ← Status Badge
└────────────────────────────────────┘
  Benjamin Kiprotich Koimett            ← Headline (display-xl)
Full-Stack Software Engineer | MERN + Go + TypeScript
I ship production applications across healthcare, agriculture...

┌───────────────┐   ┌───────────────┐
│ View My Work  │   │  Contact Me   │
└───────────────┘   └───────────────┘
  SECTION 1: HERO

╔═══════════════╗   ╔═══════════════╗   ╔═══════════════╗
║      8+       ║   ║      4+       ║   ║     24/7      ║
║ PROJECTS      ║   ║ YEARS EXP.    ║   ║ UPTIME        ║
╚═══════════════╝   ╚═══════════════╝   ╚═══════════════╝
  SECTION 2: QUICK STATS

Core Infrastructure & Tooling
    ▔▔▔▔▔▔▔▔  (primary underline)
 ████████ ████████ ████████ ████████ ████████ ████████
    React  Node.js MongoDB  TS  Docker  Golang
                         SECTION 3: TECHNICAL STACK

╔═════════════════════════════════════════════════════════════════════════════╗
║            Let's Build Something Great               ║
║   Currently open to freelance opportunities...       ║
║   ┌────────────────────┐  ┌────────────────┐         ║
║   │ Start a Conversation│  │  Get In Touch  │         ║
║   └────────────────────┘  └────────────────┘         ║
╚═════════════════════════════════════════════════════════════════════════════╝
  SECTION 5: INTERACTIVE TERMINAL

[ Bento grid of CareFacility / LandLedger / Kijiji — built, not TODO ]

┌────────────────────────── FOOTER ──────────────────────────────┐
│ benjieDev                        GitHub  LinkedIn  Dev.to          │
│ © 2026 Benjamin Kiprotich Koimett. Built with MERN & Go.       │
└───────────────────────────────────────────────────────────────────┘
```

### 3.2 Projects — `pages/Projects.jsx`

Structure: `<main>` → Header Section, Filter Tabs, Projects Grid, Loading Spinner →
`<Footer />`.

- **Header Section:** `Featured Projects` + description.
- **Filter Tabs:** `All`, `Web Dev`, `Blockchain`, `PWA` (active uses `active-filter`).
- **Projects Grid:** `ProjectCard` (thumbnail + category pill, title, description,
  tech pills, GitHub / Live Demo links), 2-up on `md:`.
- **Loading Spinner:** shown while `loading` is true.
- **Fallback dataset:** 4 hardcoded projects shown when the API request fails
  (`CareFacility Platform`, `LandLedger`, `Kijiji Corporate Cuisine`, `AgriSync`).

ASCII wireframe (excerpt):

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

Featured Projects                                        ← Header Section
Production applications shipped across healthcare, ...

( All ) ( Web Dev ) ( Blockchain ) ( PWA )                ← Filter Tabs

┌───────────────────────────┐  ┌───────────────────────────┐
│ [ IMAGE ]        [CATEGORY]│  │ [ IMAGE ]        [CATEGORY]│
│ Title                     │  │ Title                     │
│ Description ...           │  │ Description ...           │
│ (React)(Node)(MongoDB)    │  │ (TS)(Golang)(Solana)      │
│ ⌨ GitHub   ↗ Live Demo    │  │ ⌨ GitHub                  │
└───────────────────────────┘  └───────────────────────────┘
┌───────────────────────────┐  ┌───────────────────────────┐
│ ...                       │  │ ...                       │
└───────────────────────────┘  └───────────────────────────┘
  Projects Grid (1 / md:2 columns)

┌────────────────────────── FOOTER ──────────────────────────┐
│ benjieDev                        GitHub  LinkedIn  Dev.to  │
│ © 2026 Benjamin Kiprotich Koimett. Built with MERN & Go.   │
└────────────────────────────────────────────────────────────┘
```

### 3.3 ProjectDetail — `pages/ProjectDetail.jsx`

Built on tokens, legacy CSS deleted. Elements/classes:

- **Back button** (`← Back to Projects`) via `<Link>`.
- **Metadata bar** with Material Symbols (no emoji); date / read time / category.
- **MarkdownContent** — `react-markdown` rendered body with token-aligned styles.
- **Technology badges** via `tech-pill` component.
- **Skeleton** loading states.
- **Not-found** state when project not found.
- **View count** endpoint integration (from Phase 3 backend).

ASCII wireframe (excerpt):

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

← Back to Projects

╔═══════════════════════════════════════════════════════════════════════════════╗
║ ┌──────────────────────────────────────────────────────────────────────┐ ║
║ │                          HERO IMAGE                                  │ ║
║ └──────────────────────────────────────────────────────────────────────┘ ║
║ Project Title                                             ← .post-header ║
║ Description (italic)                                                     ║
║ 📅 date      ⏱ read time      📁 category                 ← Metadata bar   ║
║ #tag  #tag  #tag                                                         ← tech pills   ║
║ ────────────────────────────────────────────────────────────────────────║
║ Markdown body rendered by react-markdown                  ← .post-content║
║                                                                          ║
║ ┌────────────────── Technologies Used ──────────────────┐  ← .technologies║
║ │ (tech-badge) (tech-badge) (tech-badge)               │               ║
║ └──────────────────────────────────────────────────────┘               ║
║ ────────────────────────────────────────────────────────────────────────║
║ [ View on GitHub ]  [ Live Demo ]                          ← .project-links║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### 3.4 About — `pages/About.jsx`

Sections: Hero Section, Bio Section, Experience Timeline, Skills Grid,
Contact CTA Section, `<Footer />`.

- **Hero Section:** `md:grid-cols-12` → `md:col-span-7` text (heading
  `Engineering with Precision.` with `.text-gradient` on `Precision.`) and
  `md:col-span-5` portrait image (grayscale → color on hover).
- **Bio Section:** `md:col-span-4` sticky `About Me` heading + `md:col-span-8` paragraphs.
- **Experience Timeline:** band with `bg-surface-container-low`; 3 roles
  (`Zone01 Kisumu`, `Occulus Technologies Ltd`, `The Serenity Place Treatment Centre`),
  each with numbered highlights `01/02/03`.
- **Skills Grid:** `Technical Stack`, `md:grid-cols-2` — 4 cards: `Frontend`,
  `Backend & APIs`, `Data & DevOps`, `Blockchain & Web3`.
- **Contact CTA Section:** `.glass-panel` with `Let's build something great.`,
  Email / Phone links + GitHub / LinkedIn / Dev.to icons.
- **Footer:** shared `<Footer />` component.

ASCII wireframe (excerpt):

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

  Engineering with Precision.             ┌───────────────────┐
  I am Benjamin Kiprotich Koimett, ...    │                   │
  (col-span-7)                            │   PORTRAIT IMAGE  │  (col-span-5)
                                          │   grayscale→color │
                                          └───────────────────┘
                                Hero Section (grid-cols-12)

  About Me (sticky)   Full-stack engineer shipping production...
                        I leverage Go for its concurrency...
                          Bio Section

░ Experience ░ The professional journey so far.                       ░
░              │ Software Engineer — Zone01 Kisumu        Jan 2026–  ░
░              │   01 ...  02 ...  03 ...                            ░
░              │ Junior Frontend Developer — Occulus Tech  May–Dec   ░
░              │   01 ...  02 ...  03 ...                            ░
░              │ Manager — The Serenity Place            Jan 22–Apr  ░
░              │   01 ...  02 ...                                    ░
                        Experience Timeline (surface band)

              Technical Stack
   ┌───────────────────────────────┐ ┌───────────────────────────────┐
   │ 🌐 Frontend                   │ │ ⌨ Backend & APIs              │
   │ (React)(Next)(TS)(Tailwind)   │ │ (Node)(Go)(Express)(JWT)      │
   └───────────────────────────────┘ └───────────────────────────────┘
   ┌───────────────────────────────┐ ┌───────────────────────────────┐
   │ ☁ Data & DevOps               │ │ 🗄 Blockchain & Web3          │
   │ (Mongo)(Postgres)(Docker)     │ │ (Solana)(Poly Amoy)(Contracts)│
   └───────────────────────────────┘ └───────────────────────────────┘
               Skills Grid (md:2 columns)

╔═══════════════════════════════════════════════════════════════════╝
║ Let's build something great.        ✉ Email   ☎ Phone  | ⌨ 🔗 ✎ ║
╚═══════════════════════════════════════════════════════════════════╝
  Contact CTA Section (glass-panel)

┌────────────────────────────── FOOTER ──────────────────────────────┐
│ benjieDev   © 2026 ... Built with MERN & Go.  GitHub LinkedIn Dev.to│
└────────────────────────────────────────────────────────────────────┘
```

### 3.5 AdminLogin — `pages/AdminLogin.jsx`

Tailwind-token based. Structure: Atmospheric Background (decorative blur blobs) →
Login Container → Back Link (`Home`) + Login Card (`.glass-panel`).

- **Login Card:** Heading (`Admin Login`, `Access the technical console.`),
  Form (Error Message, Username field, Password field, Submit Button `Sign In`),
  Footer Text (`System v2.4.0 (MERN & Go)`, `About` / `Projects` links).
- On success stores `adminToken` in `localStorage` and redirects to
  `/admin/dashboard`.

ASCII wireframe (excerpt):

```
        ·  ·        atmospheric background blobs (blurred)         ·  ·

              ← Home                                     ← Back Link

        ╔═════════════════════════════════════════════╗
        ║ Admin Login                                  ║
        ║ Access the technical console.                ║
        ║ ┌──────────────────────────────────────────┐ ║
        ║ │ ⚠ error message (hidden unless error)    │ ║
        ║ ├──────────────────────────────────────────┤ ║
        ║ │ 👤 Username  [ admin_id              ]   │ ║
        ║ │ 🔒 Password  [ ••••••••              ]   │ ║
        ║ │ [           Sign In              →   ]   │ ║
        ║ └──────────────────────────────────────────┘ ║
        ║ ──────────────────────────────────────────── ║
        ║   System v2.4.0 (MERN & Go)                  ║
        ║   About   Projects                           ║
        ╚════════════════════════════════════════════════╝
            Login Card (.glass-panel)
```

### 3.6 AdminDashboard — `pages/AdminDashboard.jsx`

Two-column shell: `AdminLayout`/`Sidebar` + Main Content Canvas.

Active view is driven by `activeTab` state (no routing, but responsive sidebar).

**Sidebar:**

- **Brand Header** — `B. Koimett` / `Admin Console`.
- **Navigation Links** — `Dashboard`, `Projects`, `Settings` (active item gets
  `bg-primary/10 border-r-4 border-primary`).
- **Session Badge** — indicates active admin session; instant logout.
- **Support** → mailto.

**Main Content Canvas** (`max-w-container-max`):

- **Success banner** (auto-dismiss after 3s).
- **Dashboard Overview Section** (`id="dashboard"`) — `System Overview` + Stat Cards
  Grid: `Total Projects` (from API), `Portfolio Views` (summed views from API),
  `Last Updated` (from API).
- **Projects Management Section** (`id="projects"`) — header + `Add Project` button;
  **`ProjectFormDrawer`** slide-over (title, slug, category, tech/tags pills,
  readTime, status, markdown body + preview), focus trap, Esc/backdrop close.
- **Settings Section** (`id="settings"`) — renders `<AdminSettings />`.
- **Bottom Spacer** (`h-20`).

ASCII wireframe (excerpt):

```
┌────────────────┬─────────────────────────────────────────────────────────────┐
│ B. Koimett     │  System Overview                          ┌ success banner ┐ │
│ Admin Console  │  Real-time performance metrics...         └────────────────┘ │
│                │                                                             │
│ ▎▌ Dashboard   │  ╔════════════╗ ╔════════════╗ ╔════════════╗               │
│    Projects    │  ║ TOTAL      ║ ║ PORTFOLIO  ║ ║ LAST       ║               │
│    Settings    │  ║ PROJECTS   ║ ║ VIEWS      ║ ║ UPDATED    ║               │
│                │  ║     8      ║ ║    1.2k    ║ ║     2h     ║               │
│                │  ║ ↑ +3 mo.   ║ ║ ↑ +12% wk  ║ ║ 2h ago ... ║               │
│                │  ╚════════════╝ ╚════════════╝ ╚════════════╝               │
│                │                    id="dashboard"                            │
│                │ ─────────────────────────────────────────────────────────── │
│  Support       │  Manage Projects                        [+ Add Project]      │
│ ┌────────────┐ │  Update, edit, or remove entries...         id="projects"   │
│ │ Logout   → │ │  ┌─ Create / Edit Project form (when open) ──────────────┐ │
│ └────────────┘ │  │ Title | Description | Content(MD) | Category+ReadTime  │ │
│                │  │ Technologies | Tags | Status   [Submit] [Cancel]       │ │
│                │  └────────────────────────────────────────────────────────┘ │
│                │  ┌─ Projects Table ───────────────────────────────────────┐ │
│                │  │ Title    │ Category │ Tech Stack │ Status │ Actions    │ │
│                │  │ img Name │ Web Dev  │ (pills)    │ ● pub  │ ✎ 🗑 👁     │ │
│                │  └────────────────────────────────────────────────────────┘ │
└────────────────┴─────────────────────────────────────────────────────────────┘
  SideNavBar                              Main Content Canvas
```

### 3.7 AdminSettings — `pages/AdminSettings.jsx`

Rendered as a tab inside `AdminDashboard`, **not a route**. Restyled with design tokens;

double import removed; add read-only **Raw Config** viewer (derived values only —
no `JWT_SECRET`/`MONGODB_URI`) + simulated SSH key status; keep credential form.

- `.settings-container` → `<h2>Settings</h2>`
- `.settings-form` → **Change Username** (`.form-section`), **Change Password**
  (`.form-section`: New Password, Confirm Password), error/success messages,
  `.save-btn` (`Save Changes`).
- **Raw Config Viewer:** code-styled JSON panel with derived values only (e.g.,
  app version, feature flags, SSH key simulated status). Never renders env secrets.

ASCII wireframe (excerpt):

```
┌─ settings-container ─────────────────────────────────┐
│ Settings                                             │
│ ╔═ settings-form ════════════════════════════════════╗│
│ ║ Change Username                                    ║│
│ ║ New Username [ Enter new username              ]   ║│
│ ║ Leave empty to keep current username               ║│
│ ║ ─────────────────────────────────────────────────  ║│
│ ║ Change Password                                    ║│
│ ║ New Password     [ Enter new password          ]   ║│
│ ║ Confirm Password [ Confirm new password        ]   ║│
│ ║ ─────────────────────────────────────────────────  ║│
│ ║ [ error / success message ]                        ║│
│ ║ [                Save Changes                 ]    ║│
│ ║ ─────────────────────────────────────────────────  ║│
│ ║ [ Raw Config Viewer ]      [ Simulated SSH Key ]   ║│
│ ╚═════════════════════════════════════════════════════╝│
└──────────────────────────────────────────────────────┘
```

---

## 4. Naming Conventions

### Files & components

- Pages: `pages/PascalCase.jsx`, default export (`Home`, `Projects`, `ProjectDetail`, …).
- Shared component: `components/Navbar.jsx`; context: `context/ThemeContext.jsx`, `context/AuthContext.jsx`.
- Admin components: `components/admin/AdminLayout.jsx`, `components/admin/Sidebar.jsx`, etc.
- Section names are **code comments** in public pages (e.g. `SECTION 1: HERO`) and
  **`id` attributes** in admin sections (`dashboard`, `projects`, `settings`).

### Styling vocabulary

- Tailwind utility-first with a custom token vocabulary defined in
  `index.css` (`@theme`): surfaces (`surface`, `surface-container-low/high/…`),
  text (`on-surface`, `on-surface-variant`), brand (`primary`, `primary-container`,
  `secondary`, `error`), borders (`outline`, `outline-variant`).
- Spacing tokens: `stack-sm|md|lg`, `gutter`, `section-gap`, `container-max`.
- Type tokens: `display-xl(-mobile)`, `display-lg`, `headline-lg|md|sm`,
  `body-lg|md`, `label-md`; mono via `font-code-sm` / `text-code-sm`.
- Custom component classes: `glass-card`, `glass-panel`, `btn-primary`,
  `btn-secondary`, `input-base`, `tech-pill`, `active-filter`, `emerald-glow`,
  `text-gradient`, `font-display-*`.
- Icons: Google **Material Symbols (Outlined)** loaded in `index.html`, used as
  `<span className="material-symbols-outlined">name</span>`.
- Responsive: `md:` (768px) and `lg:` (1024px); content container
  `max-w-container-max mx-auto px-gutter`.

### Layout shell

```
<Navbar />            fixed top, z-50, h-16, glass background
<main>                pt-32 on public pages (nav offset)
<footer>              bg-surface-dim, border-t (Home / Projects / About only)
```

---

## 5. Known Gaps / Revamp Notes

Collected from the code audit; these represent known knowns as of the as-built state.

### Design system / theming

- Theme toggle in Navbar persists choice to `localStorage`; system preference detection
  on initial load.
- Light mode `:root` variables in `index.css` are reached via `@theme inline { --color-surface: var(--surface); ... }`.
- `.text-gradient` accent used on About hero and ProjectDetail metadata bar.
- Global transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)` on `background-color`, `border-color`, `color`, `fill`, `stroke`.

### Duplicate / inconsistent UI

- Footer is now a single shared `<Footer />` component — no more duplication.
- Shared `Button`, `Card`, `Container`, `Section`, `SectionHeading` components eliminate
  per-page CSS repetition.
- Buttons use `<Link>` instead of raw `<a href>`.
- `active-filter` class replaces duplicated `.active-filter` patterns.

### Dead / orphaned styles & classes (resolved)

- `styles/ProjectDetail.css`, `styles/AdminSettings.css`, `styles/AdminDashboard.css`,
  `styles/AdminLogin.css` — **all deleted**; replaced by token-aligned component styles.
- `rim-light` and `custom-scrollbar` — removed, never re-added.
- `AdminSettings.css` double import — fixed; single import only.

### Unimplemented (remained as-is)

- `AdminSettings` exists as a tab inside `AdminDashboard`, not a route — matches PRD route map.
- No 404 page until Phase 5 add; now `*` route → `NotFound`.

### Architecture

- `AdminLayout`/`Sidebar` responsive (drawer on mobile, session badge, instant logout).
- `ProjectFormDrawer` with focus trap, Esc/backdrop close.
- `ConfigViewer` never renders `JWT_SECRET`/`MONGODB_URI`.
- Axios 401 interceptor excludes `/admin/login` to avoid redirect loops.
- View endpoint uses `useRef` guard to prevent double-count under React StrictMode.

---

## 6. Cross-References

| Document | Purpose |
|---|---|
| `@DESIGN.md` | Design tokens: colors, typography, spacing, radii, component classes, icon sizing |
| `@AGENTS.md` | Project structure, stack, API conventions, security rules |
| `benjiedev_project_brief_prd.md` | Source content (CV, projects, links) used across pages |
| `DETAILS.md` | Supplemental content and deterministic telemetry helpers |
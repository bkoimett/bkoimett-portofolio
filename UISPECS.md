# UI Specs (As-Built)

Inventory of the current user interface: pages, shared components, sections, naming
conventions, and known gaps. This is a **structural** reference for the upcoming UI
revamp — it describes what exists today, not what it should become.

- **Design tokens** (colors, type scale, spacing, icon sizing): see `@DESIGN.md`.
- **Project conventions** (stack, API, security): see `@AGENTS.md`.
- **Content source of truth**: see `DETAILS.md`.

Status: current as of the pre-revamp codebase. Update this file whenever pages,
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

Notes:

- `AdminSettings` (`pages/AdminSettings.jsx`) is **not routed**. It is rendered as a
  tab inside `AdminDashboard`.
- There is **no 404 / catch-all route**; unknown paths render an empty shell.
- `ThemeProvider` wraps the whole app, but no component consumes `useTheme`, so there
  is no theme toggle in the UI (see §5).

---

## 2. Shared Components

Only one shared component exists in `frontend/src/components/`.

### 2.1 `Navbar` — `components/Navbar.jsx`

Fixed top bar, rendered once in `App.jsx` for every route.

| Region | Name | Contents |
|---|---|---|
| Brand | Brand (`benjieDev`) | `Link` to `/`, `font-headline-md` bold |
| Desktop nav | Primary navigation | `Home`, `Projects`, `About` — active item gets `border-b-2 border-primary text-primary` |
| Desktop CTA | `Hire Me` | `mailto:koimettb@gmail.com`, pill button |
| Mobile trigger | Hamburger / Close button | Toggles the mobile panel, `aria-expanded`/`aria-controls` |
| Mobile panel | `mobile-navigation` | Same nav items + `Hire Me`; auto-closes on route change |

Active-route logic lives in `getActivePath()` (treats any `/projects*` path as
`/projects`).

### 2.2 Missing shared components

There is **no shared** `Layout`, `Footer`, `Section`, `Button`, `Card`, or `Container`
component. Consequences:

- The **footer is duplicated** inline in `Home`, `Projects`, and `About`, with
  different markup and inconsistent branding (`Benjamin Koimett` vs `benjieDev`).
- `ProjectDetail`, `AdminLogin`, and `AdminDashboard` render **no footer**.
- Buttons/cards/pills are repeated as raw utility strings or per-page CSS classes.

---

## 3. Page-by-Page Section Inventory

Section names below are taken verbatim from code comments or `id` attributes where
present.

### 3.1 Home — `pages/Home.jsx`

Named sections:

1. `SECTION 1: HERO`
2. `SECTION 2: QUICK STATS`
3. `SECTION 3: TECHNICAL STACK`
4. `SECTION 4: LATEST WORK (Bento Grid)` — **unimplemented** (comment: `SKIP FOR NOW` / `TODO`)
5. `SECTION 5: FINAL CTA`
6. `SECTION 6: FOOTER`

Sub-parts:

- **Hero:** Status Badge (`Available Immediately · Remote-Ready`), Headline
  (`Benjamin Kiprotich Koimett`), Subheading, Description, Buttons (`View My Work`,
  `Contact Me`).
- **Quick Stats:** 3 Stat Cards — `8+ Projects Shipped`, `4+ Years Experience`,
  `24/7 Production Uptime`.
- **Technical Stack:** heading `Core Infrastructure & Tooling` + 6 tech cards
  (React, Node.js, MongoDB, TypeScript, Docker, Golang).
- **Final CTA:** heading `Let's Build Something Great` + buttons
  (`Start a Conversation` → `/about`, `Get In Touch` → mailto).
- **Footer:** brand + copyright + `GitHub` / `LinkedIn` / `Dev.to`.

#### ASCII wireframe

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

                    · · · · · · emerald glow (absolute) · · · · · ·

                    ┌────────────────────────────────────┐
                    │ ⌨  Available Immediately · Remote-Ready │   ← Status Badge
                    └────────────────────────────────────┘
                      Benjamin Kiprotich Koimett            ← Headline (display-xl)
                    Full-Stack Software Engineer | MERN + Go + TypeScript
              I ship production applications across healthcare, agriculture, ...
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
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ React  │ │ Node.js│ │MongoDB │ │  TS    │
   └────────┘ └────────┘ └────────┘ └────────┘
   ┌────────┐ ┌────────┐
   │ Docker │ │ Golang │
   └────────┘ └────────┘
                        SECTION 3: TECHNICAL STACK

        ~~~ SECTION 4: LATEST WORK (Bento Grid) — TODO, not built ~~~

      ╔══════════════════════════════════════════════════════╗
      ║            Let's Build Something Great               ║
      ║   Currently open to freelance opportunities...       ║
      ║   ┌────────────────────┐  ┌────────────────┐         ║
      ║   │ Start a Conversation│  │  Get In Touch  │         ║
      ║   └────────────────────┘  └────────────────┘         ║
      ╚══════════════════════════════════════════════════════╝
                        SECTION 5: FINAL CTA

┌────────────────────────── SECTION 6: FOOTER ──────────────────────────────┐
│ Benjamin Koimett  © 2026 All rights reserved.   GitHub  LinkedIn  Dev.to  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Projects — `pages/Projects.jsx`

Structure: `<main>` → Header Section, Filter Tabs, Projects Grid, Loading Spinner →
`<footer>`.

- **Header Section:** `Featured Projects` + description.
- **Filter Tabs:** `All`, `Web Dev`, `Blockchain`, `PWA` (active uses `.active-filter`).
- **Projects Grid:** `ProjectCard` (inline `<article>`), 2-up on `md:`;
  image + category pill, title, description, tech pills, `GitHub` / `Live Demo` links.
- **Loading Spinner:** shown while `loading` is true.
- **Footer:** same family as Home but branded `benjieDev`.
- **Fallback dataset:** 4 hardcoded projects shown when the API request fails
  (`CareFacility Platform`, `LandLedger`, `Kijiji Corporate Cuisine`, `AgriSync`).

#### ASCII wireframe

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

Uses **legacy plain CSS** (`styles/ProjectDetail.css`), not the design tokens.

Elements/classes: `.project-detail` → `.back-btn` (`← Back to Projects`),
`.blog-post` → Hero (`.hero-image`), Header (`.post-header`: `<h1>`, `.description`),
Metadata (`.post-meta`: date / read time / category, prefixed with emoji),
Tags (`.tags` / `.tag`), Main Content (`.post-content`, rendered via `react-markdown`),
Technologies (`.technologies` / `.tech-list` / `.tech-badge`), Links (`.project-links`
with `.btn.btn-primary` and `.btn.btn-secondary`).

#### ASCII wireframe

```
┌───────────────────────────── NAVBAR (fixed) ─────────────────────────────┐
│ benjieDev                 Home   Projects   About              [Hire Me] │
└──────────────────────────────────────────────────────────────────────────┘

← Back to Projects                                        ← .back-btn

╔═══════════════════════════ .blog-post ═══════════════════════════════════╗
║ ┌──────────────────────────────────────────────────────────────────────┐ ║
║ │                          HERO IMAGE                                  │ ║
║ └──────────────────────────────────────────────────────────────────────┘ ║
║ Project Title                                             ← .post-header ║
║ Description (italic)                                                     ║
║ 📅 date      ⏱ read time      📁 category                 ← .post-meta    ║
║ #tag  #tag  #tag                                          ← .tags         ║
║ ────────────────────────────────────────────────────────────────────────║
║ Markdown body rendered by react-markdown                  ← .post-content║
║                                                                          ║
║ ┌────────────────── Technologies Used ──────────────────┐  ← .technologies║
║ │ (tech-badge) (tech-badge) (tech-badge)               │               ║
║ └──────────────────────────────────────────────────────┘               ║
║ ────────────────────────────────────────────────────────────────────────║
║ [ View on GitHub ]  [ Live Demo ]                          ← .project-links║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 3.4 About — `pages/About.jsx`

Sections: Hero Section, Bio Section, Experience Timeline, Skills Grid,
Contact CTA Section, Footer.

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
- **Footer:** same family, branded `benjieDev`.

#### ASCII wireframe

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

  About Me (sticky)   Full-stack engineer shipping production ...
                      I leverage Go for its concurrency ...
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

   ╔══════════════════════════════════════════════════════════════════╗
   ║ Let's build something great.        ✉ Email   ☎ Phone  | ⌨ 🔗 ✎ ║
   ╚══════════════════════════════════════════════════════════════════╝
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

#### ASCII wireframe

```
        ·  ·        atmospheric background blobs (blurred)         ·  ·

              ← Home                                     ← Back Link

        ╔══════════════════════════════════════════════╗
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
        ╚══════════════════════════════════════════════╝
                    Login Card (.glass-panel)
```

### 3.6 AdminDashboard — `pages/AdminDashboard.jsx`

Two-column shell: `SideNavBar` (`<aside>`) + Main Content Canvas (`<main>`).
Active view is driven by `activeTab` state (no routing).

**SideNavBar:**

- **Brand Header** — `B. Koimett` / `Admin Console`.
- **Navigation Links** — `Dashboard`, `Projects`, `Settings` (active item gets
  `bg-primary/10 border-r-4 border-primary`).
- **Footer Actions** — `Support` (inert) and `Logout` (calls `logout()`).

**Main Content Canvas** (`max-w-container-max`):

- `success` banner (auto-dismiss after 3s).
- **Dashboard Overview Section** (`id="dashboard"`) — `System Overview` + Stat Cards
  Grid: `Total Projects` (live count), `Portfolio Views` (`1.2k`, hardcoded),
  `Last Updated` (`2h`, hardcoded).
- **Projects Management Section** (`id="projects"`) — header + `Add Project` button;
  **Projects Form** (`Edit Project` / `Create New Project`: Title, Description,
  Content (Markdown), Category + Read Time row, Technologies (comma-separated),
  Tags (comma-separated), Status select, form buttons); **Projects Table**
  (columns: Title, Category, Tech Stack, Status, Actions — edit, delete/confirm, view).
- **Settings Section** (`id="settings"`) — renders `<AdminSettings />`.
- **Bottom Spacer** (`h-20`).

#### ASCII wireframe

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

Rendered as a tab inside `AdminDashboard`, **not a route**. Uses legacy CSS
(`styles/AdminSettings.css`, imported twice).

- `.settings-container` → `<h2>Settings</h2>`
- `.settings-form` → **Change Username** (`.form-section`), **Change Password**
  (`.form-section`: New Password, Confirm Password), error/success messages,
  `.save-btn` (`Save Changes`).

#### ASCII wireframe

```
┌─ settings-container ─────────────────────────────────┐
│ Settings                                             │
│ ╔═ settings-form ═══════════════════════════════════╗│
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
│ ╚════════════════════════════════════════════════════╝│
└──────────────────────────────────────────────────────┘
```

---

## 4. Naming Conventions

### Files & components

- Pages: `pages/PascalCase.jsx`, default export (`Home`, `Projects`, `ProjectDetail`, …).
- Shared component: `components/Navbar.jsx`; context: `context/ThemeContext.jsx`.
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
  `gradient-stats`, `text-gradient`, `font-display-*`.
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

Collected from a read of the current source; useful starting points for the revamp.

**Design system / theming**

- `ThemeContext` + `toggleTheme` exist but **nothing consumes `useTheme`** — no toggle
  in the UI, so the app is effectively **dark-only**. The light-mode `:root`
  variables in `index.css` are never reached by the `@theme` tokens.
- The `.text-gradient` accent is only applied on the About hero heading; no other page
  uses the gradient.

**Duplicate / inconsistent UI**

- Footer is **duplicated three times** (Home, Projects, About) with different markup
  and branding (`Benjamin Koimett` vs `benjieDev`). No shared `Footer`/`Layout`.
- No shared `Button`/`Card`/`Container`; the same patterns are re-typed per page.
- `px-6` is used instead of the `px-gutter` token in several sections.
- Internal links use raw `<a href>` (Home CTA → `/about`, `/projects`) instead of
  React Router `<Link>`.

**Dead / orphaned styles & classes**

- `styles/AdminLogin.css` is **never imported** (orphaned).
- `rim-light` and `custom-scrollbar` are referenced in `AdminDashboard.jsx` but
  **never defined** anywhere.
- `styles/AdminSettings.css` is imported **twice** in `AdminSettings.jsx`.
- `ProjectDetail.css` defines `.btn-primary` / `.btn-secondary`, **colliding** with
  the design-system classes of the same name; the page is not token-aligned and uses
  emoji in metadata.

**Unimplemented / inert**

- Home `SECTION 4: LATEST WORK (Bento Grid)` is a TODO — not built.
- No 404 / catch-all route.
- Admin stat cards show **hardcoded fake metrics** (`Portfolio Views = 1.2k`,
  `+3 from last month`, `+12% vs last week`, `Last Updated = 2h`).
- Admin `Support` button and the table row `visibility` (👁) button do nothing.

**Architecture**

- `AdminSettings` exists as a page file but is only reachable as a tab; it is not in
  the route table. Consider whether it should be a route in the revamp.
- `AdminDashboard` mixes Tailwind tokens with legacy `.post-form` / `.form-group` /
  `.submit-btn` CSS.

---

## 6. Cross-References

| Document | Purpose |
|---|---|
| `@DESIGN.md` | Design tokens: colors, typography, spacing, radii, component classes, icon sizing |
| `@AGENTS.md` | Project structure, stack, API conventions, security rules |
| `DETAILS.md` | Source content (CV, projects, links) used across pages |

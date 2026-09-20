# Design System

This document defines the visual design system for the project. All new components and pages must follow these tokens, patterns, and conventions.

---

## Stack

- **Framework:** Vite + React 19 (JSX)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme inline` in `index.css`)
- **Fonts:** Newsreader (serif — display + body) + IBM Plex Mono (indexes, numerals, stamps)
- **Dark mode:** Class-based via `.dark` on `<html>` with ThemeContext provider, `localStorage` persistence, and `prefers-color-scheme` detection. Light and dark palettes are distinct — `:root` and `.dark` override the same `@theme inline` tokens.

---

## Concept

**Registry Office.** The portfolio is styled as an official records office — the products it ships (a land registry, patient records, farm ledgers) are registry systems. The visual language is that of filed forms and ledgers: near-white paper, hairline rules, mono reference numbers, stamped availability, sentence-case labels. One authority colour (registry green), one signal colour (a red stamp, used once per page).

Avoid: glass cards, soft shadows, gradient washes, centered text blocks, pill labels, icon fonts, ALL-CAPS eyebrows, and `→` on every link.

---

## Colors

All values are hex, defined as CSS custom properties on `:root` / `.dark` and exposed to Tailwind through `@theme inline`.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `paper` | `#f5f7f4` | `#121816` | Page background |
| `paper-strong` | `#edf1ec` | `#18211c` | Cards, fills, framed surfaces |
| `ink` | `#16211b` | `#e4eae5` | Primary text |
| `ink-muted` | `#54625a` | `#9aa9a1` | Secondary text |
| `registry` | `#14532d` | `#5fa575` | Links, accents, fills (authority) |
| `registry-dim` | `#3c6b4f` | `#93c3a5` | Hover / emphasised registry |
| `rule` | `#d9e1da` | `#27332b` | Hairline borders, dividers |
| `rule-strong` | `#b7c4ba` | `#3c4c41` | Strong borders, focus, table heads |
| `stamp` | `#a83c2c` | `#e0705c` | The single availability stamp + errors |
| `on-registry` | `#f5f7f4` | `#0b1a11` | Text on registry fills |

Rules of use:
- Green is reserved for authority (links, current state, primary actions).
- Red is a stamp: one per page (availability) plus error states.
- Uppercase is allowed only where an official form genuinely stamps it (REG. NO., FILED, DIVISION); everywhere else use sentence case.

---

## Typography

### Font Families

| Font | Weight | Usage |
|---|---|---|
| **Newsreader** | 400, 500, 600, 700 | All display + body text (editorial serif) |
| **IBM Plex Mono** | 400, 500, 600 | Reference numbers, file indexes, stamps, tables, code |

### Type Scale (Tailwind utilities)

| Token | Size | Line | Weight | Usage |
|---|---|---|---|---|
| `text-masthead` | `clamp(2.5rem → 5.25rem)` | 1.02 | 600 | Home hero name |
| `text-heading-xl` | `clamp(2rem → 3rem)` | 1.08 | 600 | Section mastheads |
| `text-heading` | 1.75rem | 1.15 | 600 | Page titles |
| `text-title` | 1.375rem | 1.25 | 600 | Card / section titles |
| `text-title-sm` | 1.125rem | 1.3 | 600 | Project record titles |
| `text-body` | 1.0625rem | 1.65 | 400 | Default body |
| `text-body-sm` | 0.9375rem | 1.6 | 400 | Compact body |

Component classes: `file-index` (mono 13px) and `file-index-sm` (mono 12px) for indexes/numerals; `.stamp` for the availability stamp.

---

## Spacing

| Token | Value | Usage |
|---|---|---|
| `gutter` | 24px | Horizontal page padding |
| `section` | 96px | Vertical rhythm between sections |
| `container-max` | 1240px | Max content width |

Container pattern: `<div className="container-page">` (wraps max-width + gutter).

---

## Border Radius

Near-zero throughout — `rounded-[2px]` on buttons, inputs, and frames. No large-radius cards; no pill-shaped chips (the registry does not round its forms). Borders are hairline `1px var(--rule)` or `3px double var(--rule-strong)` for ledger dividers.

---

## Buttons

| Class | Style | Use |
|---|---|---|
| `.btn-primary` | solid registry green fill | Primary action |
| `.btn-stroke` | 1px strong-rule outline | Secondary action |
| `.btn-ghost` | text only (muted → registry) | Tertiary / inline |

Button copy names the action, sentence case: "Project records", "File new record", "Save changes". Never "Submit".

---

## Components

| Component | Notes |
|---|---|
| `layout/Layout` | Public shell: masthead + `<main>` + document footer. Public routes wrap themselves with `<Layout>`. |
| `layout/Footer` | Registry document footer (filing lines, record index, correspondence). Reads profile from `data/profile.js`. |
| `components/Navbar` | Masthead — no icons, text nav, `bk / 026` monogram, shared `ThemeToggle`. |
| `components/ThemeToggle` | Shared day/night toggle (mono text + glyph), used by Navbar and admin. |
| `primitives/ProjectCard` | Case-file row: reg no., title, division, description, tech index, Source/Live/Record links, optional framed photo. |
| `primitives/StatCard` | Ruled fact row: hedge numeral + mono label. |
| `primitives/SectionHeading` | Reference line (optional) + serif heading + short rule. |
| `primitives/Button` | `primary` / `stroke` / `ghost` × `sm` / `md` / `lg`. |
| `primitives/Card` | Flat framed surface (`card-flat`). |
| `primitives/StatusBadge` | Mono bordered tag (views, read time, status). |
| `primitives/Container` / `Section` | Layout primitives. |
| `utils/cv.js` | CV helpers: public download URL, share URL (+ clipboard copy), active-CV check. |

---

## Layout Conventions

- Text is left-aligned. Never center whole sections.
- Measure: ~60–70ch for prose.
- Records (projects, tech) are rendered as ruled ledgers / index tables, not cards.
- Sections open with a `file-index-sm` reference line (e.g. `BK / PROD.`) followed by a serif heading.
- Primary page padding: `pt-14` at top, `pb-24` at bottom.

### Page structure

```
<header>          3px registry top band · sticky · hairline bottom rule
<main>            container-page, left-aligned sections
<footer>          document footer (paper-strong)
```

---

## Motion

One orchestrated entrance per page, on the home masthead only (`.animate-rise`, 0.65s). All other motion answers a user action (menu open, drawer slide, hover colour change). `prefers-reduced-motion: reduce` disables transitions and animation.

---

## Focus & Accessibility

- `:focus-visible` → 2px `var(--registry)` outline, offset 2px.
- Focus ring on inputs: 1px registry outline + border swap.
- AA contrast verified for text (ink-on-paper, registry-on-paper, *muted* ≥ 4.5 in both modes).
- Keyboard-operable admin: tab strip, drawer (Esc to close, backdrop click, focus moves to title field).

---

## Markdown (filed-document copy)

Rendered via `react-markdown` inside `.markdown-body`: serif body, square list markers, mono inline code on `paper-strong`, `3px double` horizontal/blockquote rules, hairline tables with `paper-strong` heads.

---

## Admin Console

- **Shell:** `components/admin/AdminLayout` (console masthead + `Sidebar`). Admin routes live **outside** the public `Layout`.
- **Sidebar:** index of Dashboard / Projects / CVs / Settings + session stamp + log out.
- **Metrics:** ledger fact rows, not cards.
- **Tables:** hairline registry tables, mono column heads, two-step inline delete confirm.
- **Forms:** `ProjectFormDrawer` (right-side filing form), `AdminSettings` (username / password / derived config — never raw secrets).
- **CV records:** PDFs stored in GridFS (bucket `cvs`); metadata in the `CV` model. Exactly one record is `active` and is the only one served publicly (`/api/cv`, `/api/cv/download`). Uploads are PDF-only, ≤ 10MB, via the shared API client. Public `Download CV` (`btn-stroke`) / `Share CV` (`btn-ghost`) buttons render only when an active CV exists.
- **API paths:** always `/projects` / `/admin/*` (client baseURL already includes `/api`).
- 401 responses clear the token and emit `auth-unauthorized` — `AuthProvider` flips `isAuthenticated`, `ProtectedRoute` redirects to sign-in.

---

## Tokens Reference (CSS)

Defined in `index.css`:
- `:root` = light, `.dark` = dark; `@theme inline { --color-<token>: var(--<token>) }` exposes `bg-ink`, `text-registry`, `border-rule`, etc. to Tailwind.
- Type utilities are emitted from `--text-<name>` tokens.
- Component classes live in `@layer components`: button variants, `input-base`, `file-index(-sm)`, `stamp`, `card-flat`, `ledger-row`, `container-page`, `markdown-body`, `animate-rise`.
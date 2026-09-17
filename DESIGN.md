# Design System

This document defines the visual design system for the project. All new components and pages must follow these tokens, patterns, and conventions.

---

## Stack

- **Framework:** Vite + React 19 (JSX)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme` in `index.css`)
- **Icons:** Google Material Symbols (Outlined)
- **Fonts:** Inter (sans) + JetBrains Mono (mono)
- **Dark mode:** Class-based via `.dark` on `<html>` with ThemeContext provider, `localStorage` persistence, and `prefers-color-scheme` detection. Light mode uses `@theme inline` with `--color-surface: var(--surface)`; no `dark:` prefixes everywhere.

---

## Colors

All values are hex, defined as CSS custom properties in `index.css` via the Tailwind v4 `@theme` block.

### Light Mode (`:root`)

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#f8fafc` | Page background (light) |
| `surface-dim` | `#1e293b` | Footer background (light) |
| `surface-container-low` | `#f1f5f9` | Cards, sidebar, form inputs (light) |
| `surface-container` | `#e2e8f0` | Subtle backgrounds (light) |
| `surface-container-high` | `#cbd5e1` | Hover states, table headers (light) |
| `surface-container-highest` | `#94a3b8` | Active states, logout button (light) |
| `surface-bright` | `#ffffff` | Bright surface accents (light) |
| `primary` | `#0f9d6b` | Links, icons, active states, accents (light) |
| `primary-container` | `#10b981` | Primary buttons, CTAs (light) |
| `on-surface` | `#0f0f0f` | Primary text (light) |
| `on-surface-variant` | `#64748b` | Secondary/muted text (light) |
| `on-primary` | `#ffffff` | Text on primary buttons (light) |
| `on-primary-container` | `#ffffff` | Text on primary container (light) |
| `secondary` | `#64748b` | Secondary accents (light) |
| `secondary-container` | `#a0aec0` | Secondary backgrounds (light) |
| `error` | `#b91c1c` | Error states, destructive actions (light) |
| `error-container` | `#fecaca` | Error backgrounds (light) |
| `outline` | `#64748b` | Default borders (light) |
| `outline-variant` | `#94a3b8` | Subtle borders, dividers (light) |

### Dark Mode (`.dark` class)

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#101415` | Page background |
| `surface-dim` | `#0b0f10` | Footer background |
| `surface-container-low` | `#181c1d` | Cards, sidebar, form inputs |
| `surface-container` | `#1c2021` | Subtle backgrounds |
| `surface-container-high` | `#272b2c` | Hover states, table headers |
| `surface-container-highest` | `#313536` | Active states, logout button |
| `surface-bright` | `#363a3b` | Bright surface accents |
| `primary` | `#4edea3` | Links, icons, active states, accents |
| `primary-container` | `#10b981` | Primary buttons, CTAs |
| `on-surface` | `#e0e3e5` | Primary text |
| `on-surface-variant` | `#bbcabf` | Secondary/muted text |
| `on-primary` | `#003824` | Text on primary buttons |
| `on-primary-container` | `#00422b` | Text on primary container |
| `secondary` | `#bec6e0` | Secondary accents |
| `secondary-container` | `#3e465c` | Secondary backgrounds |
| `error` | `#ffb4ab` | Error states, destructive actions |
| `error-container` | `#7f1d1d` | Error backgrounds |
| `outline` | `#86948a` | Default borders |
| `outline-variant` | `#3c4a42` | Subtle borders, dividers |

### Color Usage Summary

- Light mode reaches `:root` variables; dark mode uses `.dark` class override.
- Both modes share the same token names — `index.css` `@theme` block defines all tokens for both modes.
- `primary #0f9d6b` in light mode and `primary #4edea3` in dark mode provide contrast appropriate to each palette.
- AA verified on buttons/pills in both modes.

---

## Typography

### Font Families

| Font | Weight | Usage |
|---|---|---|
| **Inter** | 400, 500, 600, 700, 800 | All UI text |
| **JetBrains Mono** | 500 | Code, monospace content |

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `display-xl` | 72px | 800 | 1.1 | -0.04em | Hero title (desktop light) |
| `display-xl-mobile` | 48px | 800 | 1.1 | -0.03em | Hero title (mobile light) |
| `display-lg` | 64px | 700 | 1.1 | -0.03em | Large display headings |
| `headline-lg` | 32px | 700 | 1.3 | - | Section headings |
| `headline-md` | 24px | 600 | 1.4 | - | Card titles, sub-headings |
| `headline-sm` | 18px | 600 | 1.4 | - | Navbar brand, small headings |
| `body-lg` | 18px | 400 | 1.6 | - | Large body text |
| `body-md` | 16px | 400 | 1.6 | - | Default body text |
| `label-md` | 14px | 500 | 1.2 | 0.02em | Labels, buttons, nav items |

### Custom Typography Classes

| Class | Definition |
|---|---|
| `font-code-sm` | JetBrains Mono, 12px, weight 500 |
| `text-code-sm` | font-size 12px |

---

## Spacing

### Tokens

| Token | Value | Usage |
|---|---|---|
| `stack-sm` | 8px | Tight gaps, small spacers |
| `stack-md` | 16px | Standard gaps between elements |
| `stack-lg` | 32px | Section internals, card padding |
| `gutter` | 24px | Horizontal page padding |
| `section-gap` | 120px | Vertical gap between page sections |
| `container-max` | 1280px | Max content width |

### Container Pattern

```html
<div className="max-w-container-max mx-auto px-gutter">
```

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `border-radius` | 4px | Base radius |
| `border-radius-md` | 8px | Buttons, inputs |
| `border-radius-lg` | 16px | Cards, panels |
| `border-radius-xl` | 24px | Modals, large cards |

---

## Component Classes

### `glass-card`

```css
/* Light mode */
bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-lg

/* Dark mode */
/* Same CSS — Tailwind token ratios resolve per-mode via @theme */
```

Hover state: `border-primary shadow-lg -translate-y-1`

### `glass-panel`

```css
/* Light mode */
bg-surface-container-low/70 backdrop-blur-xl border-t border-l border-outline-variant/30 rounded-lg

/* Dark mode */
/* Same CSS — Tailwind token ratios resolve per-mode via @theme */
```

### `btn-primary`

```css
px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold
hover:brightness-110 active:scale-95 transition-all duration-200
```

### `btn-secondary`

```css
px-6 py-3 border border-outline text-on-surface rounded-lg font-semibold
hover:bg-white/5 transition-all duration-200
```

### `input-base`

```css
w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg
text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
```

### `tech-pill`

```css
px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[14px]
```

### `active-filter`

```css
bg-primary text-on-primary
```

### `emerald-glow`

```css
background: radial-gradient(circle at center, rgba(78, 222, 163, 0.15) 0%, transparent 70%)
```

### `text-gradient`

```css
background: linear-gradient(135deg, #4edea3 0%, #006c49 100%)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

### `status-pulse`

```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite
```

### `terminal-cursor`

```css
animation: cursor-blink 1s step-end infinite
```

### `focus-visible-ring`

```css
outline: 2px solid var(--primary)
outline-offset: 2px
```

### `reduced-motion-guard`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## Layout

### Page Structure

```
<Navbar />           -- fixed top, z-50, h-16, glass background
<main>               -- pt-32 for public pages (offset for fixed nav)
  {content}
<footer>             -- bg-surface-dim, border-t
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| `md:` | 768px | Grid column changes, desktop nav |
| `lg:` | 1024px | Multi-column layouts |

### Grid Patterns

| Pattern | Usage |
|---|---|
| `grid grid-cols-1 md:grid-cols-2 gap-stack-lg` | Project cards |
| `grid grid-cols-2 lg:grid-cols-4 gap-stack-md` | Tech stack grid |
| `grid grid-cols-1 md:grid-cols-3 gap-stack-md` | Stat cards |
| `grid grid-cols-1 md:grid-cols-12 gap-gutter` | About page layout |

---

## Icons

**Library:** Google Material Symbols (Outlined)

Loaded via `<link>` in `index.html`.

### Sizing

| Size | Class | Usage |
|---|---|---|
| SM | `text-sm` or `text-[18px]` | Inline icons, nav arrows |
| MD | `text-[20px]` | Action icons, form icons |
| LG | `text-xl` | Table action buttons |
| XL | `text-[48px]` | Hero stat numbers |

### Common Icons Used

`terminal`, `dashboard`, `folder_open`, `settings`, `logout`, `add`, `edit`, `delete`,
`visibility`, `code`, `open_in_new`, `mail`, `call`, `link`, `arrow_back`, `login`,
`error`, `check_circle`, `person`, `lock`, `dns`, `database`, `data_object`, `deployed_code`,
`memory`, `cloud`, `web`, `analytics`, `trending_up`, `history`, `help`

---

## Dark Mode

- **Method:** Class-based via `.dark` on `<html>` with ThemeContext provider,
  `localStorage` persistence, and `prefers-color-scheme` detection.
- **Default:** System preference.
- **Toggle:** Navbar theme toggle button; persists to `localStorage`.
- **CSS:** `:root` defines light mode variables, `.dark` class overrides them.
- **Global transition:** All elements have `200ms cubic-bezier(0.4, 0, 0.2, 1)` transition on
  `background-color`, `border-color`, `color`, `fill`, `stroke` — applied via `[transition]` on the
  root, with `reduced-motion-guard` for `prefers-reduced-motion`.

---

## Branding

### Logo Text

Navbar brand: `benjieDev` in `font-headline-md` bold, `on-surface`.

### Gradient Accent

```css
linear-gradient(135deg, #4edea3 0%, #006c49 100%)
```

Used for `.text-gradient` on About page heading and ProjectDetail metadata bar.

---

## Markdown Styling

`react-markdown` rendered content gets token-aligned styles via `index.css`. Key styles:

- `markdown-body h1, h2, h3, h4, h5, h6` — uses type scale tokens (`headline-lg`, `headline-md`, etc.)
- `markdown-body p` — `body-md` (`16px / 1.6`)
- `markdown-body code` — `font-code-sm` / `text-code-sm` with `surface-container-low` bg + `outline` border + `px-2 py-1 rounded` padding
- `markdown-body pre` — `rounded-lg` + `px-4 py-3 bg-surface-container-high` + `font-code-sm` + `overflow-x-auto`
- `markdown-body blockquote` — `border-l-4 border-primary/30 pl-4 italic text-on-surface/60` + `my-4`
- `markdown-body ul, ol` — `list-disc inside decimal-leading-zero`
- `markdown-body table` — `min-w-full rounded-lg bg-surface-container-low/70 border border-outline-variant/30 text-on-surface caption-bottom`

---

## Effects

### Transitions

- **Global transition:** `200ms cubic-bezier(0.4, 0, 0.2, 1)` on `background-color`, `border-color`, `color`, `fill`, `stroke`
- Applied via `[transition]` on the root element; `reduced-motion-guard` overrides for
  `prefers-reduced-motion: reduce`.

### Keyframes

| Name | Definition |
|---|---|
| `pulse` | `0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 }` |
| `cursor-blink` | `0%, 100% { opacity: 1 } 50% { opacity: 0 }` |
| `status-pulse` | `0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 }` |

---

## Admin Console Specific

### View Transition Guard

- View counter endpoint uses `useRef` to prevent double-count under React StrictMode in dev.

### Config Viewer

- Raw Config Viewer never renders `JWT_SECRET`/`MONGODB_URI` — only derived values (app version,
  feature flags, simulated SSH key status).

---

## Cross-References

| Document | Purpose |
|---|---|
| `@AGENTS.md` | Project structure, stack, API conventions, security rules |
| `benjiedev_project_brief_prd.md` | Project brief & PRD |
| `UISPECS.md` | As-built UI component and page inventory |
| `DETAILS.md` | Source content and deterministic telemetry helpers |
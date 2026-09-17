# Design System

This document defines the visual design system for the project. All new components and pages must follow these tokens, patterns, and conventions.

---

## Stack

- **Framework:** Vite + React 19 (JSX)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme` in `index.css`)
- **Icons:** Google Material Symbols (Outlined)
- **Fonts:** Inter (sans) + JetBrains Mono (mono)
- **Dark mode:** ThemeContext provider with localStorage + system preference detection

---

## Colors

All values are hex, defined as CSS custom properties in `index.css` via the Tailwind v4 `@theme` block.

### Surface

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#101415` | Page background |
| `surface-dim` | `#0b0f10` | Footer background |
| `surface-container-low` | `#181c1d` | Cards, sidebar, form inputs |
| `surface-container` | `#1c2021` | Subtle backgrounds |
| `surface-container-high` | `#272b2c` | Hover states, table headers |
| `surface-container-highest` | `#313536` | Active states, logout button |
| `surface-bright` | `#363a3b` | Bright surface accents |

### Text

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#e0e3e5` | Primary text |
| `on-surface-variant` | `#bbcabf` | Secondary/muted text |
| `on-primary` | `#003824` | Text on primary buttons |
| `on-primary-container` | `#00422b` | Text on primary container |

### Brand

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#4edea3` | Links, icons, active states, accents |
| `primary-container` | `#10b981` | Primary buttons, CTAs |
| `secondary` | `#bec6e0` | Secondary accents |
| `secondary-container` | `#3e465c` | Secondary backgrounds |
| `error` | `#ffb4ab` | Error states, destructive actions |
| `error-container` | `#7f1d1d` | Error backgrounds |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `outline` | `#86948a` | Default borders |
| `outline-variant` | `#3c4a42` | Subtle borders, dividers |

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
| `display-xl` | 72px | 800 | 1.1 | -0.04em | Hero title (desktop) |
| `display-xl-mobile` | 48px | 800 | 1.1 | -0.03em | Hero title (mobile) |
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

### glass-card

```css
bg-black/40 backdrop-blur-xl border border-white/5 rounded-lg
```

Hover state: `border-primary shadow-lg -translate-y-1`

### glass-panel

```css
bg-black/40 backdrop-blur-xl border-t border-l border-white/5 rounded-lg
```

### btn-primary

```css
px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold
hover:brightness-110 active:scale-95 transition-all duration-200
```

### btn-secondary

```css
px-6 py-3 border border-outline text-on-surface rounded-lg font-semibold
hover:bg-white/5 transition-all duration-200
```

### input-base

```css
w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg
text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
```

### tech-pill

```css
px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[14px]
```

### active-filter

```css
bg-primary text-on-primary
```

### emerald-glow

```css
background: radial-gradient(circle at center, rgba(78, 222, 163, 0.15) 0%, transparent 70%)
```

### text-gradient

```css
background: linear-gradient(135deg, #4edea3 0%, #006c49 100%)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
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

`terminal`, `dashboard`, `folder_open`, `settings`, `logout`, `add`, `edit`, `delete`, `visibility`, `code`, `open_in_new`, `mail`, `call`, `link`, `arrow_back`, `login`, `error`, `check_circle`, `person`, `lock`, `dns`, `database`, `data_object`, `deployed_code`, `memory`, `cloud`, `web`, `analytics`, `trending_up`, `history`, `help`

---

## Dark Mode

- **Method:** Class-based via ThemeContext with `localStorage` + `prefers-color-scheme`
- **Default:** System preference
- **Toggle:** Managed through ThemeContext provider
- **CSS:** `:root` defines light mode variables, `.dark` class overrides them
- **Global transition:** All elements have `200ms cubic-bezier(0.4, 0, 0.2, 1)` transition on `background-color`, `border-color`, `color`, `fill`, `stroke`

---

## Branding

### Logo Text

Navbar brand: `benjieDev` in `font-headline-md` bold, `text-on-surface`.

### Gradient Accent

```css
linear-gradient(135deg, #4edea3 0%, #006c49 100%)
```

Used for `.text-gradient` on About page heading.

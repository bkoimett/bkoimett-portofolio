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

### Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAFAFF` | Page background — warm off-white with cool undertone, not cream, not pure white |
| `surface` | `#FFFFFF` | Crisp white for cards, sections, used sparingly for hierarchy |
| `accent` | `#0891B2` | Primary accent — clear cyan-teal, distinctive and intentional (not terracotta/cliché) |
| `muted` | `#64748B` | Secondary/muted text, dividers, subtle accents |
| `ink` | `#1E293B` | Primary body text in dark mode |
| `border` | `#CAD3C9` | Default borders, structural separation |

### Light Mode

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#1E293B` | Primary text |
| `on-surface-variant` | `#64748B` | Secondary/muted text |
| `border` | `#CAD3C9` | Default borders |

### Dark Mode

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#F8FAFC` | Primary text |
| `on-surface-variant` | `#98A2B3` | Secondary/muted text |
| `border` | `#3A3E4D` | Default borders |

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
| `body-lg` | 18px | 400 | 1.5 | - | Large body text |
| `body-md` | 16px | 400 | 1.5 | - | Default body text |
| `label-md` | 14px | 500 | 1.4 | 0.02em | Labels, buttons, nav items |

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
| `section-gap` | 96px | Vertical gap between page sections |
| `container-max` | 1280px | Max content width |

### Container Pattern

```html
<div className="max-w-container-max mx-auto px-gutter">
```

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `border-radius` | 6px | Base radius, cards |
| `border-radius-md` | 8px | Buttons, inputs |
| `border-radius-lg` | 12px | Section corners, moderate rounding |
| `border-radius-xl` | 16px | Large cards, modals |

---

## Component Classes

### card

```css
bg-surface border border-border rounded-lg p-6 transition-colors duration-200 hover:bg-surface/80
```

Subtle separation — no glass blur, avoiding the SaaS-card kit cliché.

### card-hover

```css
card hover:bg-accent/5
```

### panel

```css
bg-surface border-t border-2 border-accent rounded-t-lg py-4
```

Single accent border — structural, not decorative.

### btn-primary

```css
px-6 py-3 bg-accent text-on-accent rounded-lg font-semibold hover:opacity-110 active:scale-95 transition-all duration-200
```

### btn-secondary

```css
px-6 py-3 border border-muted text-on-surface rounded-lg font-semibold hover:bg-surface/5 transition-all duration-200
```

### input-base

```css
w-full px-4 py-3 bg-surface/50 border border-border rounded-lg text-on-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-200
```

### container-max

```html
<div className="max-w-container-max mx-auto px-gutter">
```

### section-divider

```css
border-t border-border/20 my-12
```

Horizontal structural divider — informs content hierarchy.

### tech-pill

```css
px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-medium
```

### active-filter

```css
bg-accent text-on-accent
```

### font-code-sm

JetBrains Mono, 12px, weight 500

### text-code-sm

font-size 12px

### text-gradient

```css
background: linear-gradient(135deg, #0891B2 0%, #0E7490 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Gradient accent using the primary accent color — not the default emerald gradient.

---

## Layout

### Page Structure

```
<Navbar />           -- fixed top, z-50, h-16, subtle accent border
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
| `grid grid-cols-1 md:grid-cols-3 gap-stack-lg` | Project cards (3 columns desktop) |
| `grid grid-cols-2 lg:grid-cols-4 gap-stack-md` | Tech stack grid (4 columns desktop) |
| `grid grid-cols-1 md:grid-cols-2 gap-stack-md` | Stat cards, feature grids |
| `grid grid-cols-1 md:grid-cols-12 gap-gutter` | About page layout |

### Line Length Guideline

- Default body text: < 80 characters (Inter at 16px/1.5)
- Accent/display type: controlled via letter-spacing and max-width

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

### Accent Usage

```css
linear-gradient(135deg, #0891B2 0%, #0E7490 100%)
```

Used for `.text-gradient` on About page heading and intentional accent spots throughout. Not applied indiscriminately.

---

## Motion

- **Page-load:** Single fade-in-up orchestrated entrance — one coordinated moment, not scattered effects
- **Hover:** Subtle opacity/scale on interactive elements (buttons, links, cards)
- **Reduced motion:** All transitions respect `prefers-reduced-motion`
- **No micro-animations on every element** — motion answers a person's action or one page-load reveal

---

## Writing in Design

- Words appear to make it easier to understand and use — design content, not decoration
- Write from the end user's perspective: name things by what users will understand in simple language
- Active voice as default: "Save changes," not "Submit"
- Keep tone conversational: plain verbs, sentence case, no filler, matched to brand and audience
- Treat failure and emptiness as moments for direction, not mood
- Empty screen is an invitation to act
- One written element = one job
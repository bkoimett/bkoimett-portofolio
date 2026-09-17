# Project Brief & PRD: benjieDev Portfolio & Admin Console

**Project Title:** benjieDev (Benjamin Kiprotich Koimett Portfolio & Engineering Console)  
**Version:** 2.4.0  
**Status:** In Progress / UI Revamp Phase  
**Author / Principal Engineer:** Benjamin Kiprotich Koimett  
**Date:** March 2025  

---

## 1. Executive Summary & Vision

**benjieDev** is the flagship digital portfolio, technical showcase, and administrative management console for **Benjamin Kiprotich Koimett**, a Full-Stack Software Engineer specializing in high-concurrency, fault-tolerant backend architectures (Go, Node.js), robust web applications (React 19, TypeScript), and distributed Web3 systems.

Unlike standard static portfolio websites, benjieDev pairs an authentic, modern engineering aesthetic (**"Minimalist Tech Terminal"** / emerald dark-mode ecosystem) with a functional administrative control plane for real-time project management, telemetry tracking, and system configuration.

---

## 2. Target Audience & Personas

| Persona | Primary Needs & Goals | Core Journey |
| :--- | :--- | :--- |
| **Engineering Hiring Managers & Tech Leads** | Quickly verify production-readiness, system scale, code quality, technical depth, and tech stack match (Go, TypeScript, MERN, Rust). | Land on Hero → review Quick Stats & Core Tooling → inspect Featured Deployments / GitHub links → review Experience Timeline on About page. |
| **Enterprise / Web3 Clients & Founders** | Review real-world case studies (Healthcare HIPAA-grade systems, Blockchain land registries, Enterprise logistics) and verify reliability. | Hero → Featured Case Studies → live preview / demo exploration → "Hire Me" / "Get In Touch" CTA. |
| **Fellow Developers & Community** | Explore architecture writeups, tech stack choices, performance benchmarks, and terminal interface. | Terminal interaction / project deep-dives → Dev.to & GitHub links. |
| **Site Owner (Benjamin Koimett)** | Efficiently showcase new projects, publish markdown case studies, monitor views, and adjust portfolio settings without redeploying code. | `/admin/login` → Authentication → Admin Console Dashboard → Add/Edit Project with Markdown editor. |

---

## 3. Product Goals & Core Objectives

1. **High Visual & Brand Alignment:** Strictly enforce the visual design language defined in `DESIGN.md` (emerald glow, `#101415` page canvas, JetBrains Mono accents, and glassmorphic card patterns).
2. **Unified Component Architecture:** Eliminate UI duplication identified in `UISPECS.md` (e.g., duplicated footers, scattered button classes) by establishing reusable, token-aligned components.
3. **Interactive Terminal & Production Feel:** Deliver a tactile, developer-first experience through an interactive terminal simulation and real performance telemetry metrics (latency, uptime, tech pills).
4. **End-to-End Content Management:** Empower self-service project creation, updating, and markdown-based case study publishing via a clean, secured admin dashboard.
5. **Speed & Accessibility:** Ultra-fast load times with zero heavy blocking assets, responsive across mobile and desktop, with full keyboard navigation and semantic HTML.

---

## 4. Information Architecture & Route Map

### 4.1 Route Hierarchy
```
benjieDev App
├── Public Routes (with Persistent Navbar & Shared Footer)
│   ├── / (Home)
│   │   ├── Section 1: Hero (Status Badge, Name, Subtitle, CTAs, Emerald Glow)
│   │   ├── Section 2: Quick Metrics (8+ Projects, 4+ Years Exp, 24/7 Uptime)
│   │   ├── Section 3: Core Infrastructure & Tooling (React, Go, Node, TS, Mongo, Docker)
│   │   ├── Section 4: Featured Systems & Bento Grid (CareFacility, LandLedger, Kijiji Cuisine)
│   │   ├── Section 5: Interactive Terminal / Bio Stats Console
│   │   └── Section 6: Final Call to Action ("Let's Build Something Great")
│   ├── /projects (Projects Index)
│   │   ├── Header Section & Category Tabs (All, Web Dev, Blockchain, PWA)
│   │   ├── Project Grid (Filterable cards with tech pills, latency tags, repo & demo links)
│   │   └── Fallback & Loading States
│   ├── /projects/:slug (Project Case Study Detail)
│   │   ├── Back Button navigation
│   │   ├── Header, Hero Media, & Metadata Bar (Date, Read Time, Category, Tags)
│   │   ├── Markdown Technical Body (Architecture diagrams, challenges, solutions)
│   │   └── Technology Badges & Action Links
│   └── /about (About & Engineering Philosophy)
│       ├── Split Hero (Precision Statement + Grayscale/Hover-Color Portrait)
│       ├── Sticky Bio Section (Background & Technical Principles)
│       ├── Experience Timeline (Zone01 Kisumu, Occulus Tech, The Serenity Place)
│       ├── Technical Stack 4-Pillar Grid (Frontend, Backend & APIs, DevOps, Web3)
│       └── Direct Contact Panel (Email, Phone, Dev Socials)
│
└── Admin Routes (Protected Shell)
    ├── /admin/login (Public Token Authentication Gate)
    └── /admin/dashboard (Authenticated Control Plane)
        ├── Submenu 1: Telemetry Dashboard (Overview metrics, traffic charts, project counts)
        ├── Submenu 2: Project Manager (Interactive CRUD table, markdown editor modal)
        └── Submenu 3: Settings (Password updates, raw JSON configuration editor)
```

---

## 5. Functional Requirements & Specifications

### 5.1 Public Pages

#### PRD-F01: Global Navigation (`Navbar`)
- **Top Bar:** Fixed `z-50 h-16` with `bg-black/40 backdrop-blur-xl` and `border-b border-white/5`.
- **Brand Element:** `benjieDev` clickable logo directing to `/`.
- **Nav Links:** `Home`, `Projects`, `About` with active indicator `border-b-2 border-primary text-primary (#4edea3)`.
- **Primary Action:** `Hire Me` button (`mailto:koimettb@gmail.com`).
- **Administrative Gateway:** Discrete `Admin Console` lock icon trigger linking to `/admin/login` or toggling admin view.
- **Mobile Responsiveness:** Hamburger toggle menu expanding full-screen drawer with accessible ARIA states.

#### PRD-F02: Home Page Experience
- **Availability Status:** Live pulsing pill badge: `Available Immediately · Remote-Ready`.
- **Hero Title:** `Benjamin Kiprotich Koimett` (`display-xl` 72px, -0.04em tracking) with gradient emerald accent subtitle.
- **Quick Metrics:** 3 Bento-style stat cards with icons and animated numerical highlights.
- **Technical Tooling Grid:** 6 primary technology cards (React, GoLang, Node.js, TypeScript, MongoDB, Docker) with category badges and descriptive roles.
- **Interactive Terminal:** Simulated shell environment in `JetBrains Mono` responding to macro buttons (`$help`, `$projects`, `$stack`, `$uptime`, `$contact`).
- **Featured Systems:** Grid showing top 3 verified deployments with benchmark telemetry (response time in ms, status indicators).

#### PRD-F03: Projects Catalog & Filter Engine
- **Filter Bar:** Instant client-side filtering across `All`, `Web Dev`, `Blockchain`, and `PWA` categories.
- **Project Cards:** Card featuring thumbnail/preview banner, category pill, title, excerpt description, tech stack tags (`.tech-pill`), and external links (`Code` → GitHub, `Demo` → live deployment).
- **Graceful Fallbacks:** Guaranteed rendering of 4 core offline fallback projects if backend API fails.

#### PRD-F04: Detailed Project Case Study (`/projects/:slug`)
- **Markdown Rendering:** Full markdown engine rendering headings, code blocks, lists, and quotes.
- **Metadata Header:** Standardized metadata banner (estimated read time, publish date, category).
- **Token Alignment:** Elimination of legacy CSS; replacement with Tailwind `@theme` tokens.

#### PRD-F05: About Page & Career Journey
- **12-Column Responsive Layout:** Asymmetrical layout pairing personal statement with developer headshot.
- **Interactive Timeline:** Step-by-step career milestones (Zone01, Occulus, Serenity Place) with key numbered deliverables (`01`, `02`, `03`).
- **Domain Competency Matrix:** 4 grouped skill cards:
  1. *Frontend:* React, Next.js, TypeScript, Tailwind CSS
  2. *Backend & APIs:* Go, Node.js, Express, REST/GraphQL, JWT Auth
  3. *Data & DevOps:* MongoDB, PostgreSQL, Docker, CI/CD pipelines
  4. *Blockchain & Web3:* Solana, Polygon Amoy, Smart Contracts

---

### 5.2 Admin Console Requirements

#### PRD-F06: Authentication & Security
- **Login Gate:** Dedicated clean login interface with username and password fields.
- **Session Handling:** Store JWT/admin session securely in client storage; automatic redirect to `/admin/login` when expired or unauthenticated.
- **Sudo / Admin Indicator:** Visual badge indicating active administrative session with instant logout.

#### PRD-F07: Telemetry & Analytics Dashboard
- **Metric Cards:** Total Projects, Portfolio View Count, and System Last Updated timestamp.
- **Visual Charts:** Simulated traffic throughput/view trends via lightweight vector SVG graphs.

#### PRD-F08: Project CRUD Management
- **Projects Data Table:** Tabular inventory displaying Project Name, Category, Tech Stack, Status (Published/Draft), and Action buttons.
- **Actions:**
  - `Add Project`: Opens slide-over/modal form with title, slug, category, tech pills, and markdown body.
  - `Edit Project`: Pre-populates form for quick updates.
  - `Delete Project`: Requires two-step confirmation before removal.
  - `Visibility Toggle`: Quick toggle between Draft and Public display.

#### PRD-F09: System & Configuration Settings
- **Credential Management:** Change administrator username and password with validation.
- **Raw Config View:** Code-styled JSON configuration interface simulating system parameters and SSH key status.

---

## 6. Design System & Token Specifications

### 6.1 Color Palette
- **Surface Canvas:** `#101415` (Page background)
- **Surface Dim:** `#0b0f10` (Footers, code blocks)
- **Container Low:** `#181c1d` (Cards, sidebar, inputs)
- **Container High / Hover:** `#272b2c`
- **Active State:** `#313536`
- **Primary Brand Emerald:** `#4edea3`
- **Primary CTA Fill:** `#10b981`
- **Text Primary (`on-surface`):** `#e0e3e5`
- **Text Secondary (`on-surface-variant`):** `#bbcabf`
- **Borders & Dividers:** Default `#86948a`, Subtle `#3c4a42`

### 6.2 Typography & Spacing
- **Sans Font:** `Inter` (weights 400, 500, 600, 700, 800)
- **Monospace Font:** `JetBrains Mono` (weights 400, 500)
- **Type Scale:** `display-xl` (72px / line-height 1.1), `headline-lg` (32px), `headline-md` (24px), `body-md` (16px / line-height 1.6), `label-md` (14px).
- **Max Width Container:** `1280px` (`max-w-container-max mx-auto px-gutter`).

---

## 7. Non-Functional & Technical Specifications

| Category | Requirement |
| :--- | :--- |
| **Frontend Framework** | React 19 (JSX) + Vite |
| **Styling Architecture** | Tailwind CSS v4 (`@theme` CSS-first token configuration in `index.css`) |
| **Iconography** | Google Material Symbols (Outlined) via standard font ligature |
| **Markdown Engine** | Lightweight markdown parser for case study and project content |
| **State & Storage** | React state / Context API for navigation tabs and admin auth token persistence |
| **Performance Benchmark** | Lighthouse score ≥ 95 on Desktop (Performance, Accessibility, Best Practices, SEO) |
| **Browser Support** | Modern Evergreen Browsers (Chrome, Firefox, Safari, Edge) |

---

## 8. Implementation Milestones & Roadmap

- [x] **Phase 1: Token Definition & UI Specs Audit** — Standardized tokens and identified code gaps (`DESIGN.md`, `UISPECS.md`).
- [x] **Phase 2: Minimalist Tech Terminal Prototype** — Interactive prototype with terminal simulation and admin mockup.
- [x] **Phase 3: Public UI Revamp** — Fully specs-aligned Hero, Bento grids, verified project case studies, and responsive layout.
- [ ] **Phase 4: Shared Component Refactoring** — Extract unified `<Navbar />`, `<Footer />`, `<ProjectCard />`, and `<Button />` components to eliminate duplication.
- [ ] **Phase 5: API & Backend Integration** — Connect Project CRUD forms and analytics to Go/Express backend endpoints.
- [ ] **Phase 6: Theme Toggle & Polishing** — Connect existing `ThemeContext` to an explicit UI toggle and finalize light-mode tokens.

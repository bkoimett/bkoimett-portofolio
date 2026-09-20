# Benjamin Kiprotich Koimett | Portfolio

> A Registry Office–styled portfolio with an admin console — a MERN stack, custom design system, and secured content management.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building for Production](#building-for-production)
- [API Endpoints](#api-endpoints)
- [Design System](#design-system)
- [Admin Access](#admin-access)
- [License](#license)
- [Author](#author)

---

## Overview

A full-stack portfolio and content management system for **Benjamin Kiprotich Koimett** — Full-Stack MERN & Go Engineer. Public pages showcase his work, and a separate admin console manages projects and settings.

The design language is **Registry Office**: near-white paper, hairline rules, mono reference numbers, editorial serif (Newsreader) with a mono index voice (IBM Plex Mono), a single forest-green authority accent, and one red stamp per page. No glass cards, icon fonts, or gradient washes.

**Key Highlights:**

- **Design system-aligned UI** — CSS-first Tailwind v4 tokens in `index.css`; distinct light/dark palettes via `.dark` class; theme persisted with no FOUC.
- **Unified component architecture** — Shared `Layout`, `Navbar`, `Footer`, and primitives (`Button`, `Card`, `Section`, `SectionHeading`, `ProjectCard`, …) eliminate duplication.
- **Admin console** — JWT-secured dashboard, projects ledger with two-step delete, filing-form drawer, and settings with a derived-values-only config view.
- **Fully responsive** — Mobile-first with `sm:` / `md:` / `lg:` breakpoints; mobile navigation drawer.
- **Accessible** — Visible focus rings, `prefers-reduced-motion` support, AA contrast in both themes.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Styling (CSS-first config via `@theme inline`) |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client (single shared instance in `utils/api.js`) |
| **React Markdown** | Filed-document body rendering |
| **Newsreader + IBM Plex Mono** | Typography (Google Fonts) |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server (routes inline in `index.js`) |
| **MongoDB + Mongoose** | Database & ODM (no ORM) |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **express-rate-limit** | Login attempt throttling |

### DevOps

| Technology | Purpose |
|------------|---------|
| Git | Version control |
| npm | Package management |
| dotenv | Environment configuration |
| supertest + node:test | Backend API tests |

---

## Features

### Public Pages

- **Home** — Masthead hero with availability stamp, ruled fact cells (stats), production records (project case files), technical index, and a correspondence (contact) file. When a CV is on file: `Download CV` + `Share CV` (copies the public download URL).
- **Projects** — Filterable case-file index; `ProjectCard` ledger rows (reg. no., division, tech index, Source/Live/Record links); fallback dataset if the API is unreachable.
- **Project Detail** — Filed-document view: markdown body, mono metadata, status badges, view count from backend; skeleton and not-found states.
- **About** — Employment ledger (current role marked), filing-photo portrait, technical index, attestation panel with `Download CV` when a CV is on file.

### Admin Console

- **Secure Login** — JWT with rate limiting (5 attempts / 15 min); non-revealing error messages.
- **Dashboard overview** — Total projects, summed portfolio views, last updated + telemetry chart (inline SVG bars of views per record).
- **Project management** — Create, edit, delete with published/draft status; two-step inline delete confirm; `ProjectFormDrawer` slide-over filing form (Esc/backdrop close).
- **CV records** — File multiple CV versions (PDF, ≤10MB, stored in MongoDB GridFS so they survive redeploys); mark one as the downloadable record; delete old versions. The active CV is served publicly at `/api/cv/download`.
- **Settings** — Change username/password; read-only derived console config (never `JWT_SECRET` / `MONGODB_URI`).

---

## Project Structure

```
bkoimett-portofolio/
├── backend/
│   ├── models/                 # Admin, Project, CV schemas
│   ├── middleware/
│   │   └── auth.js             # JWT bearer-token middleware
│   ├── index.js                # Express server & all routes
│   ├── gridfs.js               # GridFS bucket helper (CV files)
│   ├── seedAdmin.js            # Create the initial admin user
│   ├── tests/api.test.js       # node:test + supertest (models mocked)
│   ├── eslint.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Home, Projects, ProjectDetail, About,
│   │   │                       # AdminLogin, AdminDashboard, AdminSettings, NotFound
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Masthead shell (theme toggle, Hire Me)
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── layout/         # Layout, Footer, ScrollToTop, NotFound
│   │   │   ├── primitives/     # Container, Section, SectionHeading, Button,
│   │   │   │                   # Card, StatusBadge, StatCard, ProjectCard
│   │   │   └── admin/          # AdminLayout, Sidebar, CVsManager,
│   │   │                       # ProjectsTable, ProjectFormDrawer, TelemetryChart
│   │   ├── context/            # AuthContext (JWT), ThemeContext (day/night)
│   │   ├── utils/              # api.js (shared client), auth.js (token helpers), cv.js (CV helpers)
│   │   ├── data/               # profile.js, stats.js, techStack.js
│   │   ├── index.css           # Tailwind v4 tokens + registry component classes
│   │   ├── App.jsx             # Routes (admin outside public Layout)
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js          # Dev proxy: /api → :3001
│   └── package.json
│
├── DESIGN.md                   # Full design system reference
├── UISPECS.md                  # As-built UI inventory
├── AGENTS.md                   # Project conventions & guards
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone & Install

```bash
git clone https://github.com/bkoimett/bkoimett-portofolio.git
cd bkoimett-portofolio
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

Create `.env` in the **backend** directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>
JWT_SECRET=your_jwt_secret_key
PORT=3001
CLIENT_URL=http://localhost:5173

# Optional — used only by `npm run seed:admin`
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign/verify admin JWTs |
| `PORT` | No | API port (defaults to `3001`) |
| `CLIENT_URL` | No | Allowed CORS origin (defaults to `http://localhost:5173`) |
| `ADMIN_USERNAME` | No | Seed username for `npm run seed:admin` (defaults to `admin`) |
| `ADMIN_PASSWORD` | No | Seed password for `npm run seed:admin` (defaults to `admin123`) |

Frontend `.env` (optional): `VITE_API_URL` — only needed when the frontend is served separately from the API. In dev, `/api` is proxied to `http://localhost:3001` by `vite.config.js`, and the API client base path defaults to `/api`.

---

## Development

Run the two servers from separate terminals (no root `package.json`):

```bash
cd backend && npm run dev        # http://localhost:3001
cd frontend && npm run dev       # http://localhost:5173
```

---

## Building for Production

```bash
cd frontend && npm run build     # → frontend/dist/
cd backend && npm start          # plain Node, no build step
```

- **Frontend**: deploy `dist/` to Vercel/Netlify (client routes need an SPA fallback).
- **Backend**: deploy to Render (`render.yaml` provided), Railway, Fly.io, etc. Point `CLIENT_URL` at the deployed frontend origin.

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login (rate-limited: 5 attempts / 15 min) |
| `GET` | `/api/projects` | Published projects; authenticated requests return all (incl. drafts) |
| `GET` | `/api/projects/slug/:slug` | Get a published project by slug |
| `GET` | `/api/cv` | Active CV metadata (404 when none is on file) |
| `GET` | `/api/cv/download` | Download the active CV (PDF attachment) |
| `POST` | `/api/contact` | Submit the contact form |

### Auth-Protected Routes (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/admin/settings` | Update admin username/password |
| `GET` | `/api/projects/:id` | Get a single project by id (admin) |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `GET` | `/api/admin/cvs` | List all CV records (metadata only) |
| `POST` | `/api/admin/cvs` | Upload a new CV (multipart `cv` file + optional `label` / `active`) |
| `PUT` | `/api/admin/cvs/:id/active` | Set the downloadable CV |
| `DELETE` | `/api/admin/cvs/:id` | Delete a CV record and its file |

---

## Design System

Defined in `frontend/src/index.css` (Tailwind v4 CSS-first tokens) with a full reference in `DESIGN.md`.

**Registry palette:**

| Token | Light | Dark |
|---|---|---|
| `paper` | `#f5f7f4` | `#121816` |
| `ink` | `#16211b` | `#e4eae5` |
| `ink-muted` | `#54625a` | `#9aa9a1` |
| `registry` | `#14532d` | `#5fa575` |
| `registry-dim` | `#3c6b4f` | `#93c3a5` |
| `rule` | `#d9e1da` | `#27332b` |
| `rule-strong` | `#b7c4ba` | `#3c4c41` |
| `stamp` | `#a83c2c` | `#e0705c` |

**Typefaces** — Newsreader (display/body), IBM Plex Mono (indexes, numerals, stamps). No icon fonts; glyphs are text characters (☰ ✕ ⌘ ↳).

**Key classes** — `btn-primary` / `btn-stroke` / `btn-ghost`, `input-base`, `file-index`(-`sm`), `stamp`, `card-flat`, `ledger-row`, `container-page`, `markdown-body`, `animate-rise`.

---

## Admin Access

Authentication uses MongoDB-persisted admin users; no hardcoded credentials.

```bash
cd backend
npm run seed:admin        # reads ADMIN_USERNAME / ADMIN_PASSWORD from .env
```

The seed script is idempotent. Sign in at `/admin/login` — the login endpoint returns a generic "Invalid credentials" message for unknown usernames and wrong passwords alike, and is rate-limited (5 attempts / 15 min). Change the password afterwards via Settings.

---

## License

This project is proprietary and owned by **Benjamin Kiprotich Koimett**. All rights reserved.

---

## Author

**Benjamin Kiprotich Koimett**
- GitHub: [@bkoimett](https://github.com/bkoimett)
- LinkedIn: [Benjamin Kiprotich Koimett](https://linkedin.com/in/bkoimett)
- Email: koimettb@gmail.com

---

Built with the MERN stack + Tailwind CSS v4 design system.
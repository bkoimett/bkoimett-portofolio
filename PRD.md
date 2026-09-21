# PRD: bkoimett-portfolio

**Last Updated:** 2026-09-21  
**Version:** 2.5.0  
**Status:** Production deployed on Vercel (frontend) + Render (backend)

---

## 1. Product Overview

A personal portfolio website for Benjamin K. Koimett — full-stack software engineer. Built as a "Registry Office" themed filing system where projects, CV, and skills are presented as official records.

**Core Metaphor:** Everything is a "file" in a government registry. Projects = production records. CV = curriculum vitae on file. Skills = technical index. Admin = console.

**Live URLs:**
- Frontend: https://bkoimett-portfolio.vercel.app
- Backend: https://bkoimett-portfolio.onrender.com (free tier, cold starts ~30-60s)

---

## 2. Tech Stack

### Frontend
- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS v4 (CSS-first, no tailwind.config.js)
- **Routing:** React Router v7
- **State:** React Context (Auth, Theme)
- **HTTP:** Axios (single shared client in `utils/api.js`)
- **Build:** Vite with proxy to backend in dev

### Backend
- **Runtime:** Node.js 20+ (Express 5)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **File Storage:** GridFS (bucket `cvs`) for PDF CVs — survives redeploys
- **Auth:** Custom JWT (HS256, 7d expiry), HttpOnly not used (localStorage)
- **Rate Limiting:** express-rate-limit on login (5 req/15min)
- **Validation:** Manual (no Zod/Joi)

### DevOps
- **Frontend Deploy:** Vercel (auto on push to main)
- **Backend Deploy:** Render Free Tier (spins down after 15min inactivity)
- **CI:** None configured (manual deploy)
- **Tests:** Node.js native test runner (`node --test`) + Supertest

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                       │
│  React + Vite → Static assets + SPA routing                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS /api/* (proxied in dev)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      RENDER (Backend)                        │
│  Express 5 → MongoDB Atlas + GridFS                          │
│  • /api/projects          Public + Admin                     │
│  • /api/cv                Public (active CV only)            │
│  • /api/cv/download       Public (streams PDF)               │
│  • /api/admin/*           JWT protected                      │
│  • /api/contact           Public (no-op, logs only)          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │    MONGODB ATLAS        │
              │  • projects collection  │
              │  • admins collection    │
              │  • cvs collection       │
              │  • cvs.files/chunks     │  ← GridFS
              └─────────────────────────┘
```

---

## 4. Data Models

### Project (`backend/models/Project.js`)
```js
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, required, auto-generated from title),
  description: String (required),
  category: String (default: 'General'),
  image: String (URL, default: Unsplash placeholder),
  technologies: [String],
  github: String (URL),
  demo: String (URL),
  highlights: [String],
  content: String (Markdown/HTML for detail page),
  publishDate: Date (default: now),
  tags: [String],
  readTime: String (default: '5 min read'),
  status: Enum['draft', 'published'] (default: 'draft'),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin (`backend/models/Admin.js`)
```js
{
  _id: ObjectId,
  username: String (unique, required),
  passwordHash: String (bcrypt, required),
  createdAt: Date
}
// Methods: verifyPassword(plaintext)
```

### CV (`backend/models/CV.js`)
```js
{
  _id: ObjectId,
  label: String (optional, e.g., "2026 Full-Stack CV"),
  fileName: String (required, original filename),
  contentType: String (default: 'application/pdf'),
  size: Number (bytes),
  fileId: ObjectId (ref: GridFS cvs.files),
  active: Boolean (default: false, only ONE active at a time),
  createdAt: Date
}
```

---

## 5. API Endpoints

### Public (No Auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | All published projects |
| GET | `/api/projects/slug/:slug` | Single published project by slug |
| POST | `/api/projects/:id/view` | Increment view count (validates ObjectId) |
| GET | `/api/cv` | Active CV metadata (404 if none) |
| GET | `/api/cv/download` | Streams active CV PDF from GridFS |
| POST | `/api/contact` | Contact form (no-op, returns success) |

### Admin (JWT Bearer Token Required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Returns `{ token, message }` |
| PUT | `/api/admin/settings` | Update username/password |
| GET | `/api/admin/cvs` | All CV records (newest first) |
| POST | `/api/admin/cvs` | Upload PDF (multipart, max 10MB) |
| PUT | `/api/admin/cvs/:id/active` | Set CV as active (deactivates others) |
| DELETE | `/api/admin/cvs/:id` | Delete CV record + GridFS file |
| GET | `/api/projects` | ALL projects (including drafts) |
| GET | `/api/projects/:id` | Single project by ID (for editing) |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

---

## 6. Frontend Pages & Routes

| Route | Page Component | Auth Required | Description |
|-------|----------------|---------------|-------------|
| `/` | `Home.jsx` | No | Masthead, stats, 4 recent projects, tech index, contact |
| `/projects` | `Projects.jsx` | No | Filterable grid of all published projects |
| `/projects/:slug` | `ProjectDetail.jsx` | No | Full project view with content, highlights, links |
| `/about` | `About.jsx` | No | Employment ledger, tech index, CV download |
| `/admin/login` | `AdminLogin.jsx` | No | Login form, sets `adminToken` in localStorage |
| `/admin/*` | `AdminDashboard.jsx` | **Yes** (ProtectedRoute) | Console with tabs: Dashboard, Projects, CVs, Settings |

### Admin Console Tabs
1. **Dashboard** — Stats cards (total projects, total views, published count) + `TelemetryChart` (views by project, Chart.js)
2. **Projects** — `ProjectsTable` with inline edit/delete, "File new record" drawer (`ProjectFormDrawer`)
3. **CVs** — `CVsManager`: upload form + registry table (make active, 2-step delete)
4. **Settings** — `AdminSettings`: change username/password + derived config display

---

## 7. Key Components

### Shared Primitives (`src/components/primitives/`)
- `Container` — Max-width wrapper (1200px)
- `Section` — Vertical rhythm wrapper
- `SectionHeading` — Registry-style header (file-index + heading)
- `Button` — Variants: primary, stroke, ghost, stamp
- `Card` / `CardFlat` — Bordered containers
- `StatusBadge` — Colored pill (published/draft/active/on-file)
- `StatCard` — Large number + label (ledger row)
- `ProjectCard` — Project preview card with reg number
- `Footer` — Minimal copyright
- `ScrollToTop` — Floating button
- `NotFound` — 404 page

### Admin Components (`src/components/admin/`)
- `AdminLayout` — Sidebar (lg+) + mobile tab strip + logout
- `Sidebar` — Nav rail with active state
- `ProjectsTable` — Sortable table with actions
- `ProjectFormDrawer` — Slide-over form (create/edit)
- `CVsManager` — Upload + table with status badges
- `TelemetryChart` — Chart.js bar chart (project views)

### Context
- `AuthContext` — `adminToken` in localStorage, `login()`, `logout()`, `isAuthenticated`
- `ThemeContext` — `theme` (light/dark/system), persists to localStorage, applies `data-theme` to `<html>`

### Utils
- `api.js` — Axios instance with baseURL from `VITE_API_URL` (default `/api`), auth interceptor, 401 handler
- `cv.js` — `fetchActiveCv()` (60s timeout), `cvDownloadUrl`, `cvShareUrl()`, `copyCvLink()`
- `auth.js` — Token helpers

---

## 8. Design System (Registry Office)

**Tokens defined in `frontend/src/index.css`:**

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--ink` | `#1a1a1a` | `#f5f5f5` | Primary text |
| `--ink-muted` | `#5a5a5a` | `#a8a8a8` | Secondary text |
| `--paper` | `#fafafa` | `#1a1a1a` | Page background |
| `--paper-strong` | `#f0f0f0` | `#242424` | Card background |
| `--rule` | `#e0e0e0` | `#333` | Borders/dividers |
| `--rule-strong` | `#d0d0d0` | `#444` | Strong borders |
| `--registry` | `#2d6a4f` | `#4ade80` | Primary brand (green) |
| `--registry-strong` | `#1b4d3a` | `#22c55e` | Primary hover |
| `--on-registry` | `#fff` | `#1a1a1a` | Text on primary |
| `--stamp` | `#b91c1c` | `#ef4444` | Destructive/alert (red) |
| `--stamp-strong` | `#991b1b` | `#dc2626` | Destructive hover |

**Typography:**
- Display: `font-serif` (Georgia/serif stack) — masthead, large numbers
- UI: `system-ui, sans-serif` — body, headings
- Mono: `ui-monospace, SFMono, Menlo, monospace` — labels, codes, metadata

**Utility Classes:**
- `.file-index-sm` — 11px mono, uppercase, tracking-wide
- `.filigree` — Underline link, hover extends
- `.btn` — Base button, variants via `.btn-primary`, `.btn-stroke`, `.btn-ghost`, `.btn-stamp`
- `.input-base` — Form input styling
- `.card-flat` — Flat card with border
- `.ledger-row` — Stat display layout

**No icon fonts.** Uses inline SVG or Unicode (→, —, ✓).

---

## 9. Current State & Known Issues

### ✅ Working
- Full CRUD for projects (admin)
- CV upload to GridFS, public download, share link copy
- Theme toggle (light/dark/system) with persistence
- JWT auth with 7d expiry, 401 auto-logout
- View tracking on project detail
- Responsive design (mobile-first, sidebar collapses < lg)
- 19/19 backend tests passing
- Frontend lint + build clean

### ⚠️ Known Limitations
1. **Render Cold Starts** — Free tier spins down after 15min. First request after idle takes 30-60s. Mitigated in frontend with 60s timeout + loading state on CV fetch (`cvLoading` in Home/About).
2. **No CI/CD** — Manual deploy only
3. **No Image Upload** — Projects use external image URLs (Unsplash default)
4. **Contact Form** — No-op (TODO: nodemailer)
5. **Single Admin** — No multi-user support
6. **No Analytics** — View counts only
7. **SEO** — Basic meta tags only, no sitemap/robots.txt
8. **Accessibility** — Semantic HTML, but no formal audit

### 🐛 Recent Fixes (not yet deployed)
- `cv.js`: 60s timeout on `fetchActiveCv` to survive Render cold start
- `Home.jsx` / `About.jsx`: Loading state ("Waking CV…") while backend spins up

---

## 10. Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://...          # Required
JWT_SECRET=...                          # Required (HS256)
PORT=3001                               # Default: 3001
CLIENT_URL=https://bkoimett-portfolio.vercel.app  # CORS origin
ADMIN_USERNAME=...                      # For seedAdmin.js only
ADMIN_PASSWORD=...                      # For seedAdmin.js only
```

### Frontend (`frontend/.env` — optional)
```env
VITE_API_URL=/api    # Uses Vite proxy in dev; defaults to '/api'
```
**Note:** Do NOT set to full backend URL (bypasses proxy, breaks CORS).

---

## 11. Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Fill in values
npm run dev           # nodemon on :3001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev           # Vite on :5173, proxies /api → :3001

# Seed admin user (first time only)
cd backend
node seedAdmin.js
```

**Test Backend:** `cd backend && npm test`  
**Lint Frontend:** `cd frontend && npm run lint`  
**Build Frontend:** `cd frontend && npm run build`

---

## 12. Deployment Checklist

### Backend (Render)
- [ ] Set env vars in Render dashboard
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Health check: `/api/projects` (public)

### Frontend (Vercel)
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Env var: `VITE_API_URL=/api` (or omit)

### Database (MongoDB Atlas)
- [ ] Network access: Allow from anywhere (0.0.0.0/0) for Render
- [ ] Database user with readWrite on `portfolio` db

---

## 13. File Inventory (As-Built)

### Frontend
```
src/
├── pages/
│   ├── Home.jsx          # Masthead, stats, 4 projects, tech, contact
│   ├── Projects.jsx      # Filterable project grid
│   ├── ProjectDetail.jsx # Full project view
│   ├── About.jsx         # Employment, tech index, CV download
│   ├── AdminLogin.jsx    # Login form
│   ├── AdminDashboard.jsx# Console layout + tabs
│   ├── AdminSettings.jsx # Username/password + config
│   └── NotFound.jsx      # 404
├── components/
│   ├── primitives/       # Container, Section, Button, Card, etc.
│   ├── admin/            # AdminLayout, Sidebar, CVsManager, etc.
│   ├── layout/           # Footer, ScrollToTop, NotFound
│   ├── ProtectedRoute.jsx
│   └── ThemeToggle.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── utils/
│   ├── api.js            # Axios client
│   ├── cv.js             # CV fetch/download/share
│   └── auth.js
├── data/
│   ├── profile.js        # Name, email, links, location
│   ├── stats.js          # Stat cards for home
│   └── techStack.js      # Skills table
├── App.jsx               # Router + providers
├── main.jsx              # Entry
├── index.css             # Design tokens + global styles
└── index.html
```

### Backend
```
backend/
├── index.js              # Express app, all routes inline
├── models/
│   ├── Project.js
│   ├── Admin.js
│   └── CV.js
├── gridfs.js             # GridFS bucket helper
├── middleware/
│   └── auth.js           # JWT verification
├── seedAdmin.js          # Creates initial admin
├── tests/
│   └── api.test.js       # 19 tests (supertest + mocked models)
├── eslint.config.js      # Flat config
└── package.json
```

---

## 14. Conventions & Rules

### API
- All requests via shared `api` client (`utils/api.js`) — no ad-hoc fetch/axios
- MongoDB uses `_id`, not `id` — never assume `.id` exists
- Public endpoints never return draft/unpublished content
- Auth errors never reveal if username exists ("Invalid credentials")

### Security
- No logging of credentials, tokens, or password lengths
- JWT verification wrapped in try/catch (malformed → 401, not 500)
- CORS scoped to `CLIENT_URL` only
- Rate limit on login (5/15min)
- PDF-only upload, 10MB max, multer memory storage

### UI
- Follow Registry Office design system (`DESIGN.md`, `index.css`)
- No icon fonts, no Material UI, no component libraries
- Mobile-first, sidebar collapses at `< lg` (1024px)
- Loading states for async operations (especially CV fetch)

### Code Style
- ESLint flat config (backend + frontend)
- No console.log in committed code
- Components: PascalCase, hooks: camelCase
- Context files: `XxxContext.jsx` + `xxxContext.js` (legacy dual)

---

## 15. Future Roadmap (Unprioritized)

1. **Upgrade Render** → Paid tier to eliminate cold starts
2. **Add CI/CD** → GitHub Actions (lint, test, deploy)
3. **Image Upload** → GridFS or Cloudinary for project images
4. **Contact Form** → Nodemailer + Resend/SendGrid
5. **SEO** → Sitemap, robots.txt, Open Graph, JSON-LD
6. **Analytics** → Plausible or Vercel Analytics
7. **Project Search/Filter** → Client-side or backend
8. **Dark Mode Images** → CSS filter or picture sources
9. **Multi-admin** → Roles/permissions
10. **Tests** → Frontend (Vitest + React Testing Library)

---

## 16. Reference Documents

- `DESIGN.md` — Design tokens, components, patterns
- `UISPECS.md` — Detailed UI specifications
- `AGENTS.md` — AI agent instructions (this project's conventions)
- `README.md` — User-facing documentation

---

**End of PRD**
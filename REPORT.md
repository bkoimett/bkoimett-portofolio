# Project Inspection Report

> Generated: 2026-09-17

## Overview

Portfolio CMS for Benjamin Kiprotich Koimett — a full-stack MERN & Go engineer. Monorepo with `frontend/` (React/Vite) and `backend/` (Express/Node.js + MongoDB via Mongoose).

**Stack mismatch:** AGENTS.md and DESIGN.md describe a Next.js/TypeScript/shadcn/Drizzle stack. The actual codebase is plain JavaScript (JSX), Vite + React 19 + Tailwind v4, with Express 5 + Mongoose 9 on the backend. No TypeScript, no Drizzle, no shadcn, no Next.js.

---

## Critical Issues

### 1. Double `/api` prefix breaks all API calls

Every frontend page builds URLs as `${apiUrl}/api/...` but the default `VITE_API_URL` is unset, falling back to `'/api'`. This produces `/api/api/projects`, `/api/api/admin/login`, etc. — all 404.

**Affected files:** `AdminDashboard.jsx`, `Projects.jsx`, `ProjectDetail.jsx`, `AdminLogin.jsx`, `AdminSettings.jsx`

### 2. Duplicate navbars on Projects and About pages

`App.jsx` renders the global `<Navbar />`, but `Projects.jsx` and `About.jsx` each render their own fixed `top-0 h-16` nav on top, causing overlapping navigation bars.

---

## High Priority — Security & Reliability

### 3. Auth endpoint logs sensitive data + username enumeration

Backend logs expected username, password length, and returns distinct "Invalid username" vs "Invalid password" messages, enabling username enumeration.

**Location:** `backend/index.js:51-94`, `AdminLogin.jsx:28-46`

### 4. `GET /api/projects/:id` has no auth middleware

Draft projects are queryable by ID without authentication.

**Location:** `backend/index.js:147`

### 5. Malformed JWT crashes public projects endpoint

A bad `Authorization` header on the public `GET /api/projects` causes `jwt.verify` to throw, resulting in a 500 instead of gracefully falling back to published-only results.

**Location:** `backend/index.js:141-143`

### 6. Default admin credentials + no rate limiting

Hardcoded in-memory `admin`/`admin123` credentials, no brute-force protection, no lockout.

**Location:** `backend/config/admin.js`, `backend/index.js`

### 7. CORS wide open

`app.use(cors())` allows all origins with no production restriction.

---

## Medium Priority — Bugs & UX

### 8. React keys use `project.id` but API returns `_id`

Undefined keys for real API data (only works on fallback sample data).

**Location:** `Projects.jsx:150`

### 9. No mobile navigation

Navbar hides all links under `md:` breakpoint with no hamburger menu. Mobile users cannot navigate.

**Location:** `Navbar.jsx`

### 10. Port mismatch across configs

- `backend/.env`: `PORT=5000`
- `vite.config.js` proxy: `http://localhost:3001`
- `render.yaml`: `port: 3001`

### 11. `seed.js` has duplicated seed logic

Two complete seed routines in the same file (lines 1-126 and 127-209), both execute on run.

**Location:** `backend/seed.js`

### 12. No AbortControllers on fetches

Race conditions and setState-on-unmount warnings on rapid navigation.

### 13. `alert()`/`confirm()` in admin dashboard

Poor UX for CRUD operations.

**Location:** `AdminDashboard.jsx`

### 14. Fake analytics in admin dashboard

"System Overview" shows fabricated numbers ("1.2k", "+12%") presented as real data.

### 15. Brand name inconsistency

Navbar says `benjieDev`, footers across all pages say `ExpertMinimalist`.

### 16. Dead link to `/resume.pdf`

`Home.jsx` links to a file that doesn't exist in `public/`.

### 17. "Remember me" checkbox is decorative

No state, no handler, does nothing.

**Location:** `AdminLogin.jsx:104`

---

## Low Priority — Code Quality & Documentation

### 18. AGENTS.md / DESIGN.md describe a different stack

Reference Next.js, TypeScript, shadcn/ui, Drizzle ORM, BetterAuth — none of which exist.

### 19. README structure section is fictional

Lists files that don't exist: `routes/`, `Footer.jsx`, `ProtectedRoute.jsx`, `AuthContext.jsx`, `config/db.js`, `server.js`.

### 20. API URL logic duplicated 5 times

Should be a shared axios instance or config module.

### 21. Backend is a monolith

All 313 lines of routes, auth, and validation in a single `index.js`.

### 22. Mixed styling approaches

Tailwind v4 `@theme` + legacy CSS variables (`:root --text-primary`) + 4 per-page CSS files. `.glass-panel` defined twice.

### 23. Dead files

`App.css`, `public/vite.svg` are unused boilerplate.

### 24. No tests

`supertest` is a devDependency but zero test files exist. No test script.

### 25. No backend linting

Only the frontend has ESLint configured.

### 26. Unused imports masked by eslint

`React` and `Link` imports hidden by `varsIgnorePattern: '^[A-Z_]'`.

---

## Additional Observations

| Item | Detail |
|---|---|
| **Dependencies installed** | Both frontend and backend have `node_modules` and lock files |
| **Git status** | Clean working tree |
| **Recent activity** | Last commit added LICENSE, SKILL, AGENTS, and DESIGN docs |
| **Contact endpoint** | Logs PII, no persistence, no try/catch |
| **Error handling** | No central Express error handler, no ErrorBoundary in React |
| **JWT storage** | localStorage (XSS-vulnerable), no HttpOnly cookie option |

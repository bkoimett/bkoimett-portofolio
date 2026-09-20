# CRITICAL RULES - MUST FOLLOW

## PROJECT

- Portfolio website. Frontend: Vite + React (JS). Backend: Express + MongoDB.
- Auth: custom JWT. No ORM — use the Mongoose models directly.

## STRUCTURE

- `backend/index.js` — Express server, all routes inline
- `backend/models/` — Mongoose models (Project.js, Admin.js, CV.js)
- `backend/gridfs.js` — GridFS bucket helper for CV file storage (bucket `cvs`)
- `backend/middleware/auth.js` — JWT bearer-token middleware
- `backend/seedAdmin.js` — Script to create initial admin user
- `backend/eslint.config.js` — ESLint flat config
- `backend/tests/` — API tests (node:test + supertest, models mocked)
- `frontend/src/pages/` — Page components (Home, Projects, About, AdminLogin, AdminDashboard, AdminSettings, ProjectDetail, NotFound)
- `frontend/src/components/` — Shared primitives (Layout, Container, Section, SectionHeading, Button, Card, StatusBadge, StatCard, ProjectCard, Footer, ScrollToTop, NotFound, ProtectedRoute, ThemeToggle)
- `frontend/src/components/admin/` — Admin components (AdminLayout, Sidebar, CVsManager, TelemetryChart, ProjectsTable, ProjectFormDrawer)
- `frontend/src/context/` — AuthContext.jsx, ThemeContext.jsx
- `frontend/src/utils/` — api.js, auth.js, cv.js

## ENVIRONMENT

Backend (.env):
- `MONGODB_URI` — MongoDB connection string (required)
- `JWT_SECRET` — Secret for signing JWTs (required)
- `PORT` — Server port (default: 3001)
- `CLIENT_URL` — Frontend origin for CORS (default: http://localhost:5173)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Used by seedAdmin.js only

Frontend (optional .env):
- `VITE_API_URL` — API base URL (default: '/api', uses proxy in dev)

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise
- Don't re-explain code you just wrote; summarize the change in 1-3 lines

## PLANNING MODE

- Always ask clarifying questions before assuming design, scope, or tech stack
- Never assume tech stack or add new dependencies without asking
- Use deep-dive sub-agents only for genuinely non-trivial research (new feature areas, security review) — skip them for small, well-scoped changes to save tokens
- For small fixes (bug fixes, copy changes, styling tweaks), skip planning ceremony and just implement

## CHANGE / EDIT MODE

- For small, well-scoped changes, implement directly — sub-agent coordination overhead isn't worth it on a project this size
- Reserve sub-agents for larger parallelizable work (e.g. multi-page refactors, simultaneous frontend+backend changes)
- Use the best model for the task - premium models for complex logic (auth, data flow), mid-tier for docs/content/styling
- After completing any feature or fix, run: `npm run lint` and `npm run build` (frontend), and the backend's lint/test script if present
- Never leave `console.log` debugging statements in committed code

## SECURITY (portfolio-specific, given past findings)

- Never log credentials, tokens, or password lengths — not even in dev
- Auth error messages must not reveal whether a username exists
- Any endpoint returning draft/unpublished content must require auth
- Always wrap JWT verification in try/catch — malformed tokens must degrade gracefully, never 500
- Keep CORS scoped to the actual deployed frontend origin(s), not wide open
- No hardcoded credentials — use environment variables

## API CONVENTIONS

- All frontend requests go through the single shared API client (not ad-hoc axios/fetch calls) — do not duplicate base-URL logic
- MongoDB documents use `_id`, not `id` — never assume `.id` exists on API responses

## TESTING

- Use whatever testing tools are already installed (e.g. supertest) for backend changes
- Never assume a change works — test it, at least manually via curl/browser
- If no relevant testing tool exists for a change, ask the user whether to skip testing or add one

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages
- Design System: @DESIGN.md
- Keep this file and @DESIGN.md in sync with the actual codebase — update them as part of any change that alters stack, structure, or conventions, don't let them drift

## FILE INVENTORY (as-built)

Design language: Registry Office. See `@DESIGN.md` for tokens and conventions.

### Frontend — public components
`Layout`, `Navbar`, `ThemeToggle`, `layout/Footer`, `layout/ScrollToTop`, `layout/NotFound`,
`ProtectedRoute`, `primitives/Container`, `primitives/Section`, `primitives/SectionHeading`,
`primitives/Button`, `primitives/Card`, `primitives/StatusBadge`, `primitives/StatCard`,
`primitives/ProjectCard`

### Frontend — admin components
`components/admin/AdminLayout`, `components/admin/Sidebar`, `components/admin/ProjectsTable`,
`components/admin/ProjectFormDrawer`, `components/admin/CVsManager`, `components/admin/TelemetryChart`

### Frontend — data/context/utils
`data/profile.js`, `data/stats.js`, `data/techStack.js`, `context/AuthContext.jsx` (+ `context/authContext.js`),
`context/ThemeContext.jsx` (+ `context/themeContext.js`), `utils/api.js`, `utils/auth.js`, `utils/cv.js`

### Frontend — pages
`App.jsx`, `index.css`, `index.html`, `pages/Home.jsx`, `pages/Projects.jsx`,
`pages/ProjectDetail.jsx`, `pages/About.jsx`, `pages/AdminLogin.jsx`,
`pages/AdminDashboard.jsx`, `pages/AdminSettings.jsx`

Removed during redesign: `data/terminalCommands.js`, `lib/telemetry.js`, `src/styles/*`,
Material Symbols icon font (no icon fonts anywhere on the site).

### Modified — backend
`models/Project.js`, `index.js`, `gridfs.js`, `models/CV.js`, `tests/api.test.js`

### Modified — docs
`UISPECS.md`, `DESIGN.md`, `AGENTS.md`, `README.md`
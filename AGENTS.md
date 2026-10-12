# CRITICAL RULES - MUST FOLLOW

## PROJECT

- Portfolio website. Frontend: Vite + React (JS). Backend: Express + MongoDB.
- **MIGRATION IN PROGRESS (see `MIGRATION.md`)**: target is Vercel Functions + Supabase
  (PostgreSQL + Storage + Auth). Legacy `backend/` (Express + Mongoose + GridFS) is retained
  until each phase is verified. Do not delete it prematurely. Do NOT migrate to Next.js.
- Auth (current): custom JWT. No ORM — use the Mongoose models directly. Phase 5 evaluates
  Supabase Auth for the admin account.

## STRUCTURE

- `MIGRATION.md` — living audit + phase status for the Render→Supabase migration
- `supabase/migrations/` — versioned PostgreSQL + Storage SQL (apply in order)
- `frontend/api/` — Vercel serverless functions (Express JSON routes migrated, Phase 3)
- `frontend/api/_lib/supabase.js` — shared server-side Supabase client (service role)
- `frontend/api/_lib/auth.js` — custom-JWT bearer verification (mirrors legacy `backend/middleware/auth.js`)
- `frontend/api/_lib/http.js` — JSON response/error helpers + public cache header
- `frontend/api/_lib/serializers.js` — snake_case rows → legacy camelCase + `_id`/`id` API shape
- `frontend/api/_lib/slugs.js` — `generateSlug` + `isValidId` (accepts ObjectId and UUID)
- `frontend/api/admin/` — `login.js`, `settings.js`, `blogs/*` (admin auth + blog CRUD)
- `frontend/api/projects/`, `frontend/api/blogs/`, `contact.js`, `sitemap.js` — public API, Supabase-backed
  (project listings ordered `rank` desc, then `created_at` asc; blog listings `rank` desc, then
  `publish_date` desc)
- `backend/index.js` — Express server, all routes inline (legacy, until Phase 6)
- `backend/models/` — Mongoose models (Project.js, Admin.js, CV.js, Blog.js) (legacy)
- `backend/migrations/importRepos.js` — idempotent GitHub-repo importer for the MongoDB `projects`
  collection (upsert by slug, strips em dashes, `--dry-run` and `--skip-existing` supported;
  records file: `backend/migrations/github-repos.json`)
- `backend/migrations/github-repos.json` — curated repo records (29) consumed by `importRepos.js`
- `backend/gridfs.js` — GridFS bucket helper for CV file storage (bucket `cvs`) (legacy)
- `backend/middleware/auth.js` — JWT bearer-token middleware (legacy until Phase 5)
- `backend/seedAdmin.js` — Script to create initial admin user (legacy)
- `backend/eslint.config.js` — ESLint flat config
- `backend/tests/` — API tests (node:test + supertest, models mocked)
- `frontend/src/pages/` — Page components (Home, Projects, ProjectDetail, Blog, BlogDetail, About, AdminLogin, AdminDashboard, AdminSettings, NotFound)
- `frontend/src/components/` — Shared primitives (Layout, Container, Section, SectionHeading, Button, Card, StatusBadge, StatCard, ProjectCard, Footer, ScrollToTop, NotFound, ProtectedRoute, ThemeToggle, Skeleton, SchematicPlate, RecordFigure, CaseNotes, RichText)
- `frontend/src/components/admin/` — Admin components (AdminLayout, Sidebar, CVsManager, TelemetryChart, ProjectsTable, ProjectFormDrawer, StarRank)
- `frontend/src/context/` — AuthContext.jsx, ThemeContext.jsx
- `frontend/src/utils/` — api.js, auth.js, cv.js, images.js, plates.js, richText.js

## ENVIRONMENT

Backend (.env, legacy until Phase 6):
- `MONGODB_URI` — MongoDB connection string (required)
- `JWT_SECRET` — Secret for signing JWTs (required)
- `PORT` — Server port (default: 3001)
- `CLIENT_URL` — Frontend origin for CORS (default: http://localhost:5173)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Used by seedAdmin.js only

Vercel functions (server-only secrets, set in Vercel env):
- `SUPABASE_URL` — Supabase project URL (required once functions are deployed, Phase 3)
- `SUPABASE_SERVICE_ROLE_KEY` — Service-role key, server-only, never bundled to browser
- `SUPABASE_ANON_KEY` — Publishable anon key (public reads, Phase 5 auth)
- `SUPABASE_JWT_SECRET` — Secret for verifying Supabase Auth JWTs (Phase 5)
- `JWT_SECRET` — must match the backend value (Phase 3); verifies existing admin sessions
  until Phase 5 replaces custom JWT with Supabase Auth

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
- Project listings (public and admin) order by `rank` desc, then `created_at` asc. `rank` is the
  admin console's 0–5 star value (0 = unranked); APIs clamp it to a non-negative integer
- Blog listings (public and admin) order by `rank` desc, then `publish_date` desc, with the same
  0–5 star `rank` clamp
- View counts are incremented with `POST /projects/:id/view` and `POST /blogs/:id/view` — the
  Express route shape. `vercel.json` rewrites that shape onto the Vercel `[id]` functions, so do
  not call `POST /projects/:id` (it 404s on Express and silently never counts)
- Media paths (`/api/images/...`) must be resolved through `utils/images.js` `resolveImage`, which
  reuses the API client's origin including its localhost guard, so images resolve the same way
  requests do. Never build an API origin by hand in a component

## TESTING

- Use whatever testing tools are already installed (e.g. supertest) for backend changes
- Never assume a change works — test it, at least manually via curl/browser
- If no relevant testing tool exists for a change, ask the user whether to skip testing or add one

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages
- No em dashes (U+2014) anywhere in authored code or content; use an en dash (U+2013) or hyphen.
  Imported content is also sanitized (see `backend/migrations/importRepos.js`)
- Design System: @DESIGN.md
- Keep this file and @DESIGN.md in sync with the actual codebase — update them as part of any change that alters stack, structure, or conventions, don't let them drift

## FILE INVENTORY (as-built)

Design language: Registry Office. See `@DESIGN.md` for tokens and conventions.

### Frontend — public components
`Layout`, `Navbar`, `ThemeToggle`, `layout/Footer`, `layout/ScrollToTop`, `layout/NotFound`,
`CookieConsent`, `WhatsAppButton`, `ProtectedRoute`, `primitives/Container`, `primitives/Section`,
`primitives/SectionHeading`, `primitives/Button`, `primitives/Card`, `primitives/StatusBadge`,
`primitives/StatCard`, `primitives/ProjectCard`, `primitives/SystemMap`, `primitives/StatNumber`,
`primitives/ExpandableImage`, `primitives/Skeleton`, `primitives/SchematicPlate`,
`primitives/RecordFigure`, `primitives/CaseNotes`, `primitives/RichText` (`SystemMap`: survey plat
of filed systems with status tokens; `StatNumber`: count-up ledger numerals; `CookieConsent`: bottom
notice bar, accept/reject remembered in localStorage, footer reopens; `WhatsAppButton`: fixed
bottom-right wa.me link; `ExpandableImage`: click a figure to view it full-size in an overlay —
Esc/backdrop/close button; `Skeleton`: one placeholder per waiting shape, announced with
role=status; `SchematicPlate`: drawn survey plate for a record with no photograph, shape derived
from its stack; `RecordFigure`: a record's own image, else a plate, never nothing; `CaseNotes`:
standfirst + ruled sections; `RichText`: console-authored copy as filed text, no markdown dep)

### Frontend — admin components
`components/admin/AdminLayout`, `components/admin/Sidebar`, `components/admin/ProjectsTable`,
`components/admin/ProjectFormDrawer`, `components/admin/StarRank`, `components/admin/CVsManager`,
`components/admin/TelemetryChart` (`StarRank`: five-star rank control for projects and blogs; click
to set, click the active star to clear; drives listing order)

### Frontend — data/context/utils
`data/profile.js`, `data/stats.js`, `data/techStack.js`, `data/caseNotes.js` (authored public copy,
one entry per project slug), `data/fallbackRecords.js` (API-failure fallback for public pages),
`context/AuthContext.jsx` (+ `context/authContext.js`), `context/ThemeContext.jsx` (+
`context/themeContext.js`), `utils/api.js`, `utils/auth.js`, `utils/cv.js`, `utils/images.js`
(`resolveImage`), `utils/plates.js` (stack to plate shape), `utils/richText.js` (console copy parser
+ `isConsoleCopy` boilerplate check)

### Frontend — pages
`App.jsx`, `index.css`, `index.html`, `pages/Home.jsx`, `pages/Projects.jsx`,
`pages/ProjectDetail.jsx`, `pages/Blog.jsx`, `pages/BlogDetail.jsx`, `pages/About.jsx`,
`pages/AdminLogin.jsx`,
`pages/AdminDashboard.jsx`, `pages/AdminSettings.jsx`

Removed during redesign: `data/terminalCommands.js`, `lib/telemetry.js`, `src/styles/*`,
Material Symbols icon font (no icon fonts anywhere on the site), `utils/richText.jsx` and the
`react-markdown` rendering path on public pages (`.markdown-body` became `.rich-text`).

### Modified — backend
`models/Project.js`, `index.js`, `gridfs.js`, `models/CV.js`, `tests/api.test.js`

### Modified — docs
`UISPECS.md`, `DESIGN.md`, `AGENTS.md`, `README.md`
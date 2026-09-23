# Migration — Render/MongoDB/GridFS → Vercel + Supabase

> Status: **IN PROGRESS** · Last updated: 2026-09-23
> Task source: `Prompt.md`

This document records the audit and phase-by-phase status of migrating the Registry
Office portfolio from an always-on Render (Express + MongoDB Atlas + GridFS) backend to
Vercel Functions + Supabase (PostgreSQL + Storage + Auth).

Status labels used throughout: **DONE**, **IN PROGRESS**, **BLOCKED**, **DEFERRED**.

---

## 0) Audit (Phase 0) — DONE

### Architecture today

```
Vercel (frontend)                                Render (backend)
  └ Vite 7 + React 19 + Tailwind 4                 └ Node 20 + Express 5 (index.js, all routes inline)
    + React Router 7 + Axios                         ├ MONGODB_URI → MongoDB Atlas
  └ /api/(.*) ──rewrite──► onrender.com/api/$1       │   collections: projects | blogs | admins | cvs
  └ /sitemap.xml ──► /api/sitemap (Vercel fn)        └ GridFS buckets: cvs | images
```

Cold start on Render free tier → 30–60s first-visitor latency. This migration removes
Render from the public path entirely.

### Data models (derived from `backend/models/*`)

**projects** — `title`, `slug` (unique), `description`, `category`, `image` (external URL
or `/api/images/:id`), `technologies[]`, `github`, `demo`, `highlights[]`, `content`,
`publishDate`, `tags[]`, `readTime`, `status` (`draft`|`published`), `views`,
`createdAt`, `updatedAt`.

**blogs** — `title`, `slug` (unique), `description`, `content` (required), `image`, `tags[]`,
`readTime`, `publishDate`, `status` (`draft`|`published`), `views`, `createdAt`,
`updatedAt`.

**cvs** — `label`, `fileName`, `contentType`, `size`, `fileId` (GridFS ObjectId),
`active` (single-active invariant enforced in app code, not DB), `createdAt`.

**admins** — `username` (unique), `passwordHash` (bcrypt), `createdAt`. Custom JWT auth
(7d token, `JWT_SECRET`), no admin settings collection (settings live on the admin doc).

### Express routes (`backend/index.js`) → Vercel functions

| Method + path | Auth | Migration target |
|---|---|---|
| POST `/api/admin/login` | rate-limited (5/15m) | Vercel fn (custom JWT, done §3) + Supabase Auth (Phase 5) |
| PUT `/api/admin/settings` | JWT | Vercel fn (done §3) |
| GET `/api/projects` | optional JWT (published-only public) | Vercel fn (done §3) |
| GET `/api/projects/slug/:slug` | public, published only | Vercel fn (done §3) |
| GET `/api/projects/:id` | JWT | Vercel fn (done §3) |
| POST `/api/projects/:id/view` | public | Vercel fn (done §3) |
| POST/PUT/DELETE `/api/projects`, `/api/projects/:id` | JWT | Vercel fn (done §3) |
| GET `/api/blogs`, `/api/blogs/slug/:slug` | public, published only | Vercel fn (done §3) |
| POST `/api/blogs/:id/view` | public | Vercel fn (done §3) |
| GET `/api/admin/blogs`, POST/PUT/DELETE | JWT | Vercel fn (done §3) |
| GET `/api/cv` | public, active metadata only | Vercel fn (Phase 4, storage-coupled) |
| GET `/api/cv/download` | public, active PDF | Storage signed URL (Phase 4) |
| GET `/api/admin/cvs`, POST, PUT `:id/active`, DELETE | JWT | Vercel fn (Phase 4, storage-coupled) |
| POST `/api/admin/images` | JWT, 5MB image | Storage (Phase 4) |
| GET `/api/images/:id` | public, 1y immutable cache | Storage redirect (Phase 4) |
| POST `/api/contact` | public, no-op | Vercel fn (done §3, no-op) |
| GET `/sitemap.xml` `/api/sitemap.xml` | public | already a Vercel fn (`api/sitemap.js`), now Supabase-backed |

### Frontend `/api` dependencies

All API calls go through `frontend/src/utils/api.js` (single axios instance, `baseURL` from
`VITE_API_URL || '/api'`, JWT from `localStorage.adminToken`, 401 → clear + `auth-unauthorized`).
Callers: `Home`, `Projects`, `ProjectDetail`, `Blog`, `BlogDetail`, `About`, admin pages via
`CVsManager`, `ProjectsTable`, `BlogsTable`, `ProjectFormDrawer`, `BlogFormDrawer`. CV helpers
in `utils/cv.js` (`/cv`, `/cv/download`).

### Admin auth flow (custom JWT — to be replaced Phase 5)

Login → bcrypt verify → `jwt.sign({id, username}, JWT_SECRET, 7d)` → client stores in
`localStorage` → `Authorization: Bearer` on admin calls. Middleware `backend/middleware/auth.js`
wraps verification in try/catch (malformed token → 401, never 500). Non-revealing errors.

### GridFS → Storage mapping

| GridFS bucket | Contents | Supabase target |
|---|---|---|
| `images` | project/blog title images, 5MB, jpeg/png/webp/gif/svg | bucket `portfolio-images` (public), paths `projects/`, `blogs/` |
| `cvs` | CV PDFs, 10MB, PDF-only | bucket `portfolio-cvs` (private), controlled download |

### Environment variables

Current backend: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, `SITE_URL`,
`ADMIN_USERNAME`/`ADMIN_PASSWORD` (seed only). Frontend: `VITE_API_URL`.

Supabase additions (Phase 1+): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET` (Phase 5). See §6 Env & deploy below.

### Deployment-specific behavior

- `frontend/vercel.json`: rewrites `/sitemap.xml` + `/api/sitemap.xml` → `/api/sitemap`,
  `/api/(.*)` → Render, SPA fallback last; cache headers for sitemap/robots.
- `frontend/api/sitemap.js`: Vercel fn, native fetch to backend public APIs, graceful fallback.
- `vite.config.js`: dev proxy `/api` + `/sitemap.xml` → `:3001`.

### Known gaps relevant to migration

- Image lifecycle: GridFS orphan images (no GC; delete of project/blog does not remove file).
  Replacement: reference-aware deletion (Phase 4).
- CV single-active invariant is app-enforced only → add partial unique index in Postgres.
- Contact form is a no-op (kept as-is, not in scope).

---

## 1) Supabase foundation — IN PROGRESS

### Decisions

- **PostgreSQL schema** lives in `supabase/migrations/` (versioned SQL, applied by hand in
  the Supabase SQL editor or via `supabase db push` — Supabase CLI not required).
- **Primary keys**: `text` PKs that preserve the legacy MongoDB `_id` after migration; new
  rows use a UUID string. This keeps the frontend `_id` contract and `/api/*/:id/view`
  URLs stable.
- **Server-side client**: single abstraction `frontend/api/_lib/supabase.js` (service-role,
  never bundled to the browser). Shared helpers live under `frontend/api/_lib/` — directories
  prefixed with `_` are ignored by Vercel's function scanner (verified in §3).
- **Storage buckets**: `portfolio-images` (public), `portfolio-cvs` (private).
- **RLS**: defense-in-depth. Public (anon) can read only `published` rows / active CV
  metadata; no anon mutation. Admin writes go through Vercel functions using the service
  role (bypasses RLS) with auth enforced in function code.

### Deliverables

- [x] `supabase/migrations/0001_initial_schema.sql` — tables, indexes, constraints, RLS
- [x] `supabase/migrations/0002_storage.sql` — buckets + storage policies
- [x] `frontend/api/_lib/supabase.js` — server-side client abstraction
- [x] `@supabase/supabase-js` added to frontend (Vercel functions) and backend (migration tooling)
      — backend install lands with Phase 2 tooling
- [x] SQL validated against a local Postgres 16 (stubbed `auth`/`storage` schemas) —
      both migrations apply cleanly; RLS behavior confirmed (anon = published/active reads only
      and no mutations; `authenticated` = published reads only; `service_role` bypasses RLS)
- [ ] apply migrations to a real Supabase project — **BLOCKED on Supabase credentials**

> BLOCKED: To finish (not fabricate) the foundation I need a live Supabase project to apply
> `supabase/migrations/0001_initial_schema.sql` + `0002_storage.sql` against. Provide
> `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (and `SUPABASE_ANON_KEY`), then this phase
> can run its final checks on the real project.

---

## 2) Data migration — IN PROGRESS

### Decisions

- Tooling runs from `backend/migrations/` (has Mongo access + Supabase client).
- Idempotent: upsert keyed on `id` (preserving the Mongo `_id`), never deletes Mongo.
- `transform.js` keeps the mappers pure and fixture-testable; `run.js` is a thin runner.
- GridFS bytes are Phase 4; `cvs.storage_path` is reserved `current/<fileId>.pdf` now and the
  storage step back-fills the bytes. Legacy image references (`/api/images/:id`) are reported
  for Phase 4 rewriting. Admin bcrypt hashes migrate as-is; `auth_user_id` null until Phase 5.

### Deliverables

- [x] `backend/migrations/transform.js` — pure Mongo→Supabase mappers
- [x] `backend/migrations/run.js` — idempotent runner (`--project|--blog|--cv|--admin`, `--dry-run`)
- [x] `backend/tests/migration.test.js` — transform tests vs fixtures (28 backend tests pass)
- [x] `backend/migrations/README.md` — procedure + required env
- [ ] production data run — **BLOCKED on Supabase credentials** (and confirmation to touch prod Mongo)
      Runbook: apply `supabase/migrations/*.sql`, set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`,
      then `cd backend && npm run migrate:dry` → `npm run migrate`.

> BLOCKED: real migration needs a live Supabase project (`SUPABASE_URL` +
> `SUPABASE_SERVICE_ROLE_KEY`) plus your go-ahead to read from the production Atlas database.

## 3) API migration — IN PROGRESS

### Scope

Vercel functions under `frontend/api/` mirroring the Express JSON routes. Migration is
incremental per route: a function file silently takes precedence over the legacy
`/api/(.*) → Render` rewrite, so any route without a function keeps working via Render.
Migration order: 1) pure-JSON routes now, 2) everything touching GridFS bytes (CV
upload/download, image upload/serve, and the admin CV list — which returns storage-coupled
records) as a single unit in Phase 4. Vercel function request bodies are capped (~4.5MB),
so proxying the 10MB CV upload through a function would be futile before Storage exists.

### Decisions

- **Custom JWT stays until Phase 5**: `frontend/api/_lib/auth.js` mirrors
  `backend/middleware/auth.js` (`verifyAdminToken`, try/catch → null → 401, never 500).
  `JWT_SECRET` must be identical in Vercel so sessions issued by Render keep working.
- **Serializers** `frontend/api/_lib/serializers.js` map snake_case rows back to the legacy
  camelCase contract — `_id` for projects/blogs, `id` for CVs (legacy `toCV` shape, used by
  `CVsManager`). Both are asserted in tests.
- **Views**: atomic increments moved to Postgres RPCs (`increment_project_view` /
  `increment_blog_view`, migration 0003) — single `UPDATE … RETURNING`, NULL when the id is
  missing (→ 404). Matches Mongoose `$inc` semantics: applies to drafts too, does **not**
  touch `updated_at`.
- **ID validation** (`_lib/slugs.js`): `isValidId` accepts legacy 24-hex ObjectIds *and* UUID
  strings, so malformed ids stay 400 (never 500) while new records work.
- **Write mapping**: camelCase body → snake_case via a whitelist (`FIELD_MAP`), mirroring
  Mongoose dropping schema-less keys on `findByIdAndUpdate`. Slug uniqueness performs an
  explicit check then cross-checks the unique index (`23505` → 400).
- **Caching**: `Cache-Control: public, max-age=300, stale-while-revalidate=86400` on strictly
  public GETs (slug detail, blogs, sitemap). `GET /api/projects` is admin-aware and is NOT
  cached — a cached admin listing could leak drafts to anonymous visitors.
- **Login rate limit**: best-effort in-memory 5/15min per IP in the function (per warm
  instance), mirroring `express-rate-limit`.
- **Dependencies**: `bcryptjs` + `jsonwebtoken` added to `frontend/package.json`
  (function/bundless-only; Vite does not bundle `api/`).

### Deliverables

- [x] `supabase/migrations/0003_views_rpc.sql` — validated on local Postgres 16 (atomic
      count-up; NULL on missing id; `updated_at` untouched)
- [x] `frontend/api/_lib/{auth,http,serializers,slugs}.js` — shared helpers
- [x] `bcryptjs` + `jsonwebtoken` in `frontend/package.json` (with lockfile)
- [x] Auth: POST `/api/admin/login` → `api/admin/login.js`; PUT `/api/admin/settings` → `api/admin/settings.js`
- [x] Projects: `api/projects/index.js` (admin-aware GET + POST create), `api/projects/[id].js`
      (GET/PUT/DELETE, JWT), `api/projects/slug/[slug].js` (public),
      `api/projects/[id]/view.js` (public POST)
- [x] Blogs: `api/blogs/index.js` (public), `api/blogs/slug/[slug].js` (public),
      `api/blogs/[id]/view.js` (public POST), `api/admin/blogs/index.js` (GET list + POST create),
      `api/admin/blogs/[id].js` (PUT/DELETE)
- [x] `api/contact.js` — no-op ack (parity with legacy)
- [x] `api/sitemap.js` now reads published slugs/dates directly from Supabase — Render
      dependency removed from the sitemap path
- [x] Frontend `npm run lint` + `npm run build` green
- [x] Local harness assertions: serializers + slug helpers, method guards (405), auth rejects
      (401), graceful 500s when env is missing, sitemap XML fallback
- [ ] Runtime verification against a deployed project — **BLOCKED on Supabase credentials**

> BLOCKED: real GET/POST/RLS-path verification needs a live Supabase project after deploy
> (set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and `JWT_SECRET`
> in Vercel). Until then functions degrade to 500 (never hang) when env is missing — verified
> via harness, not real traffic.

## 4) Storage migration — PENDING

Upload images/CVs to Supabase Storage; rewrite `/api/images/:id` and CV download to Storage;
reference-aware deletion to fix orphan images. See `Prompt.md` §Phase 4.

## 5) Admin/auth migration — PENDING

Evaluate Supabase Auth for the single admin; keep Vercel-function auth enforcement; RLS
where appropriate. See `Prompt.md` §Phase 5.

## 6) Render removal — PENDING

Only after functional verification: drop `vercel.json` Render rewrite, remove `backend/`
Mongo/GridFS legacy artifacts (kept in a clearly marked legacy state until verified),
update docs. See `Prompt.md` §Phase 6.

---

## 6) Env & deploy (target)

**Server-only secrets (never in the browser / never committed):**
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`.
Legacy (phases 1–5): `JWT_SECRET` (custom JWT until Phase 5 replaces it — **must be set
identically in Vercel from Phase 3** so existing sessions stay valid), `MONGODB_URI`
(migration tooling only, **removed** from production in Phase 6).

**Browser-safe (Vite public):** none required for the migration — Vercel functions hold the
service role; the browser only ever talks to `/api/*`. If Supabase Auth sessions are used
in the browser (Phase 5), `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` may be added.

**Deploy:** Vercel. Each file under `frontend/api/` becomes a serverless function. Shared
libs under `frontend/api/_lib/` are excluded from the function graph.

---

## Verification gates

| Gate | Command / action |
|---|---|
| Frontend lint + build | `cd frontend && npm run lint && npm run build` |
| SQL sanity | apply `supabase/migrations/*.sql` in order on a Supabase project |
| API tests | replaced/extended `backend/tests` equivalents for the data layer |
| Functional | checklist in `Prompt.md` §Verification (public + admin flows) |
| Production | fresh incognito visit must not hit Render |
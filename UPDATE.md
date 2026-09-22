# Update — bkoimett-portofolio (Registry Office)

> Generated: 2026-09-22 · Branch: `main` · Live: `https://bkoimett-portofolio.vercel.app` (Vercel) + `https://bkoimett-portofolio.onrender.com` (Render, free tier)

## 1) Snapshot

MERN portfolio as a **Registry Office filing system**. Public site shows production records (projects), filed notes (blogs), personnel record, and CV download; admin console (JWT, 7d) manages all content in GridFS/Mongo. Last milestones shipped: symmetrical detail pages (`ProjectDetail`/`BlogDetail` share `max-w-72ch` bordered header + `16/9` framed figure + `FIG.` caption), title-image upload for both (GridFS `images` bucket), Blog index preview images (right ledger column 188px, framed `4/3`), bugfix for `ProjectDetail` blank (`useParams` import) + `Vercel` `/api` proxy to Render.

All gates green: `frontend: lint + build` (Vite 7), `backend: lint + node --test` (19/19).

---

## 2) What we have — currently shipped & wired

### Frontend — routes & pages (`frontend/src/App.jsx`)
| Route | Component | Wired to API | Notes |
|---|---|---|---|
| `/` | `Home.jsx` | `GET /api/projects` | Masthead `REG. NO. BK-026`, stamp, stats (`StatNumber` rAF), `SystemMap` 2×2 plat, 4 recent `ProjectCard`, tech index, contact file (mailto + GH/LI/Dev.to, `Download CV` when active) |
| `/projects` | `Projects.jsx` | `GET /api/projects` | Category pills `all/Web Dev/Blockchain/PWA`, fallback dataset, `ProjectCard` ledger rows |
| `/projects/:slug` | `ProjectDetail.jsx` | `GET /api/projects/slug/:slug` + `POST :id/view` | Symmetrical `border-y` header, `StatusBadge` (views/readTime/category), `16/9` framed figure (`FIG. BK-PROD — slug`), `markdown-body`, `In the build` pill row, `Source`/`Live` actions. SEO `SoftwareApplication` JSON-LD |
| `/blog` | `Blog.jsx` | `GET /api/blogs` | `all` + top-8 tags, `BK / BLOG` ledger, **preview image** per row (desktop right `188px 4/3`, mobile `16/10` framed), `readTime + tags`, fallback blogs |
| `/blog/:slug` | `BlogDetail.jsx` | `GET /api/blogs/slug/:slug` + `POST :id/view` | Mirror of ProjectDetail (border-y header, `16/9` figure `FIG. BK-BLG`, `Filed under` pill row), `BlogPosting` JSON-LD |
| `/about` | `About.jsx` | `GET /api/cv` (via `cv.js`) | Employment ledger (current mark + `Current` stamp), portrait `BK-026`, tech index, attestation `Available·Remote` |
| `/admin/login` | `AdminLogin.jsx` | `POST /api/admin/login` | Rate-limited, generic `Invalid credentials`, `ThemeToggle` |
| `/admin/dashboard` | `AdminDashboard.jsx` | `GET /api/projects`, `GET /api/admin/blogs`, `GET /api/admin/cvs` | Tabs `Dashboard/Projects/Blogs/CVs/Settings` (sidebar `lg:` + mobile strip), ledger stats, `TelemetryChart`, tables + drawers. `noindex` |
| `*` | `NotFound.jsx` | — | `noindex`, `Return to the index` |

### Primitives & layout
`Layout` (sticky `border-t-[3px] border-t-registry` header + `container-page` + `Footer`), `Navbar` (mobile `☰` drawer, `ThemeToggle`), `Footer` (mono `Console` SVG lock, not 🔒, `Filed notes` link added), `ProjectCard` (`ledger-row` + `technologies` + `Source/Live/Record`), `StatusBadge`, `StatNumber` (rAF, respects `prefers-reduced-motion`), `SystemMap`, `Button/Card/Container/Section/SectionHeading`, `ThemeToggle`, `ProtectedRoute`, `ScrollToTop`, `SEO.jsx` (canonical/OG/Twitter/JSON-LD).

### Data / context / utils
`data/profile.js` (name/title/location/email/GH/LI/Dev.to), `data/stats.js`, `data/techStack.js`, `context/AuthContext.jsx` (token `adminToken`, 401 `auth-unauthorized` → logout), `context/ThemeContext.jsx` (`.dark` on `<html>`, localStorage, no FOUC), `utils/api.js` (axios `baseURL` from `VITE_API_URL||/api`, `localhost` guard for Vercel), `utils/cv.js` (`fetchActiveCv` 60s timeout, `cvDownloadUrl` → `/api/cv/download`), `utils/seo.js` + `components/SEO.jsx` (per-page title/meta/canonical/OG+JSON-LD).

### Design system (`frontend/src/index.css` + `DESIGN.md`)
`@theme inline` tokens (`paper/paper-strong/ink/ink-muted/registry/rule/stamp/on-registry`), `Newsreader` + `IBM Plex Mono`, `container-page` 1240px / gutter 24px, `rounded-[2px]`, `btn-primary/stroke/ghost`, `input-base`, `file-index(-sm)`, `stamp`, `card-flat`, `ledger-row`, `rule-double`, `markdown-body`, `animate-rise` (masthead only, `prefers-reduced-motion` guard).

### Backend — `backend/index.js` (Express 5, all routes inline)
| Method | Path | Auth | Wired | Notes |
|---|---|---|---|---|
| POST | `/api/admin/login` | — (rateLimit 5/15m) | ✓ | Generic 401, `jwt.sign 7d` |
| PUT | `/api/admin/settings` | JWT | ✓ | Username/password, bcrypt |
| GET | `/api/projects` | optional JWT | ✓ | Published-only public; all when JWT valid; try/catch malformed token |
| GET | `/api/projects/slug/:slug` | — | ✓ | Published only, 404 if missing |
| GET | `/api/projects/:id` | JWT | ✓ | Admin edit fetch by ID |
| POST | `/api/projects/:id/view` | — | ✓ | `ObjectId` validate → 400 not 500 |
| POST | `/api/projects` | JWT | ✓ | `image` string accepted (external or `/api/images/:id`) |
| PUT | `/api/projects/:id` | JWT | ✓ | Slug dedup |
| DELETE | `/api/projects/:id` | JWT | ✓ | — |
| GET | `/api/blogs` | — | ✓ | Published only, `publishDate -1` |
| GET | `/api/blogs/slug/:slug` | — | ✓ | Published only |
| POST | `/api/blogs/:id/view` | — | ✓ | — |
| GET | `/api/admin/blogs` | JWT | ✓ | All incl. drafts |
| POST | `/api/admin/blogs` | JWT | ✓ | Now accepts `image` (string) |
| PUT | `/api/admin/blogs/:id` | JWT | ✓ | — |
| DELETE | `/api/admin/blogs/:id` | JWT | ✓ | — |
| GET | `/api/cv` | — | ✓ | Active CV metadata |
| GET | `/api/cv/download` | — | ✓ | GridFS `cvs` stream, PDF attachment |
| GET | `/api/admin/cvs` | JWT | ✓ | List |
| POST | `/api/admin/cvs` | JWT | ✓ | Multer `memory` 10MB PDF-only → `cvs` bucket |
| PUT | `/api/admin/cvs/:id/active` | JWT | ✓ | Deactivates others |
| DELETE | `/api/admin/cvs/:id` | JWT | ✓ | Deletes GridFS file |
| **POST** | **`/api/admin/images`** | **JWT** | **✓ NEW** | Multer `memory` 5MB image (`jpeg/png/webp/gif/svg`) → `images` bucket, returns `{url:/api/images/:id,fileId}` |
| **GET** | **`/api/images/:id`** | — | **✓ NEW** | Public, `Cache-Control: immutable` 1y, streams from `images` bucket |
| POST | `/api/contact` | — | wired/no-op | Returns success, no email (PII not logged) |
| GET | `/sitemap.xml` + `/api/sitemap.xml` | — | ✓ | Dynamic: published projects+blogs, `isValidSlug`, dedup, `escapeXml`, `lastmod` from `updatedAt/publishDate/createdAt`, fallback to static routes on DB fail |

### Storage
`backend/gridfs.js` `getBucket(name='cvs')` + `getImageBucket()` (`images`), `backend/models/*`: `Project` (`image` string, `status` enum, `views`), `Blog` (`image` string added), `CV` (`fileId` → `cvs`), `Admin` (bcrypt).

### Admin — forms
`ProjectFormDrawer` (`max-w-xl`) + `BlogFormDrawer` (`max-w-2xl`): title/slug/division-or-tags/readTime/status/content + **title image** (`text input URL` + `Upload` → `POST /api/admin/images` → preview `border border-rule bg-paper-strong`, `Remove`). `ProjectsTable`/`BlogsTable` (mono heads, `border-registry` published, 2-step delete), `CVsManager`, `TelemetryChart`, `AdminLayout/Sidebar` (now includes `Blogs` + `CVs`, active `●`).

### SEO & ops
`frontend/index.html` canonical + OG (`/og-cover.png` 1200×630 collage) + Twitter + `Person`/`WebSite` JSON-LD. `frontend/api/sitemap.js` (Vercel function, native `fetch`, no deps, graceful fallback to static routes) + `frontend/vercel.json` rewrites: `/sitemap.xml→/api/sitemap`, `/api/sitemap.xml→/api/sitemap`, `/api/(.*)→https://bkoimett-portofolio.onrender.com/api/$1`, SPA fallback last; headers cache sitemap/robots. `frontend/public/robots.txt` (`Allow:/`, `Disallow:/admin`, `Sitemap: https://bkoimett-portofolio.vercel.app/sitemap.xml`), `frontend/vite.config.js` proxy `/api` + `/sitemap.xml → :3001`, `frontend/public/og-cover.png` present, static `sitemap.xml` removed (was shadowing dynamic).

---

## 3) What’s not wired / gaps

- **Contact form** — backend `POST /api/contact` is no-op (no `nodemailer`/Resend send), frontend has no form (only `mailto:` + GH/LI in Home/About). PII guard correct, but no delivery.
- **Admin Draft preview** — drafts exist (`status=draft`) but no public preview route or `?preview` token; admin must toggle to `published` to see detail page.
- **Image lifecycle** — upload creates GridFS file, but `PUT/DELETE` project/blog does **not** delete orphaned `images` files; no `GET /api/admin/images` listing or GC.
- **No pagination / search** — `GET /api/projects|/blogs` returns all published; `Projects` category pills + `Blog` tag pills are client-side only; no backend `?q`/`?category`/`?limit`.
- **No RSS / newsletter / comments** — blog is single-author, no feed at `/rss.xml` or subscription.
- **Analytics** — only per-record `views` counters (`TelemetryChart`); no Plausible/Vercel Analytics, no referrer/geo.
- **SEO extras** — no `hreflang`, no per-blog `og:image` override beyond title image, no `robots` per-draft (`BlogDetail` does soft `published` tag but no `noindex` for drafts because drafts never public).
- **CV single-active invariant** — enforced on upload/active, but no DB unique index; race could briefly leave two actives (app-level `updateMany`).
- **CORS** — `CLIENT_URL || http://localhost:5173` single origin; if Render env `CLIENT_URL` is `https://bkoimett-portfolio.vercel.app` (no typo `portofolio`) requests from `https://bkoimett-portofolio.vercel.app` rely on same typo host being set — currently rendered CORS header shows correct typo host, but verify Render env matches Vercel domain.
- **Cold start** — Render free tier `Spin down 15m` → 30–60s first hit; mitigated with 60s `fetchActiveCv` timeout + `Waking CV…` UI, but projects/blogs first hit also cold.
- **No CI** — no GitHub Actions, no preview deployments gate, no `frontend` Vitest (only `backend: node --test`).
- **Env file** — `frontend/.env` is `.gitignore`'d and not committed; Vercel must have `VITE_API_URL` unset (falls back to `/api` + rewrite) or set to Render host; `backend/.env` requires `MONGODB_URI`, `JWT_SECRET` (Render env).

---

## 4) What we plan to build (next, in order)

1. **Wire contact delivery** — `POST /api/contact` → `nodemailer`/Resend, env `CONTACT_TO`, honeypot + rate limit, frontend `ContactForm` in `Home` with inline success/error (replace no-op). Small, non-breaking.
2. **Draft preview** — `GET /api/projects/slug/:slug?preview=1` + `GET /api/blogs/slug/:slug?preview=1` with `?token` check (short-lived JWT), frontend `/projects/:slug?preview` when `adminToken` present. Lets editors verify before `published`.
3. **Image GC + admin listing** — `GET /api/admin/images` (paginated table), `DELETE /api/admin/images/:id` with ref-count (block if still referenced by any project/blog `image`), or nightly orphan sweep. Prevents `images` bucket growth.
4. **Pagination + server filter** — `GET /api/projects?category=&q=&limit=&offset=` and same for blogs; frontend `Projects`/`Blog` replace client filter with query, add `Link` pagination (`?page`). Keeps payload small as records grow.
5. **RSS + JSON feed** — `GET /feed.xml` + `/api/blogs/rss` from same `buildSitemapXml` data, wired to blog `image` and `publishDate`; add `<link rel="alternate">` in `index.html`/`Blog`.
6. **CI** — GitHub Actions: `frontend: lint+build`, `backend: lint+test`, Vercel preview check. `backend` already has `eslint.config.js`.
7. **Upgrade: paid Render / R2** — eliminate cold start or move image/CV storage to R2/S3 for `Cache-Control` + CDN; keep GridFS as fallback.

Not in next pass (per current brief): `hreflang`, analytics/tracking, multi-admin roles, dark-mode picture sources, full-text search.

---

## 5) Architecture at a glance

```
Vercel (frontend) — Vite 7 + React 19 + Tailwind 4 + React Router 7 + Axios
  └─ /api/(.*) ──rewrite──► https://bkoimett-portofolio.onrender.com/api/$1  (Render)
  └─ /sitemap.xml ──► /api/sitemap (Vercel function, fetches /api/projects|/blogs, fallback static)

Render (backend) — Node 20 + Express 5 → Mongo Atlas + GridFS (cvs + images)
  ├─ GET /sitemap.xml  (DB-direct, same builder as Vercel function)
  └─ Mongo: projects | blogs | admins | cvs (+ cvs.files/chunks + images.files/chunks)

Vite dev: proxy /api + /sitemap.xml → http://localhost:3001
```

`backend/index.js` is still monolithic (all routes inline); `backend/tests/api.test.js` mocks `Admin/Project/CV` statics (no real Mongo). Frontend `App.jsx` wraps public routes in `Layout`, admin outside. `utils/api.js` single `axios` instance (no duplicated `apiUrl`).

---

## 6) Env & deploy

**Backend (Render)** — `MONGODB_URI` (srv), `JWT_SECRET`, `PORT=3001`, `CLIENT_URL=https://bkoimett-portofolio.vercel.app`, `SITE_URL` (optional, sitemap canonical, default vercel.app), `ADMIN_USERNAME/ADMIN_PASSWORD` (seed only).

**Frontend (Vercel)** — `VITE_API_URL` optional (defaults `/api` → rewrite; if set to `https://bkoimett-portofolio.onrender.com` then `baseURL` → `/api` via `VITE_API_URL/api` guard). Build: `npm run build` → `dist` (SPA fallback `index.html`), output `og-cover.png` + `robots.txt` (no `sitemap.xml` static — dynamic via function).

**Local** — `backend: npm run dev` (`:3001`), `frontend: npm run dev` (`:5173` proxies), `backend: npm run seed:admin`, `backend: npm test` (`node --test tests/api.test.js` 19 pass), `frontend: npm run lint && npm run build`.

---

## 7) Risks to watch

- `backend/index.js` size (~850 lines) — sitemap helper + image routes now share file; extract to `routes/` next if it grows.
- `frontend/api/sitemap.js` duplicates `buildSitemapXml`/`isValidSlug` from backend — intentional (no shared package between `backend`/`frontend`); keep in sync when validation changes.
- `images` bucket has no listing/GC → monitor Atlas storage.
- `POST /api/admin/images` is JWT-protected but `GET /api/images/:id` is public cache-1y — fine for title images, but CV `cvs` remains PDF-only 10 MB; images 5 MB limit enforced by `imageUpload` filter.
- `vercel.json` rewrite order matters — ` /api/(.*)` must stay after sitemap rewrites, before SPA fallback.


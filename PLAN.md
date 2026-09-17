# Implementation Plan

> Generated: 2026-09-17
> Based on findings in the project inspection report.

---

## Phase 1: Critical Fixes (Day 1)

Goal: Make the app functional.

### 1.1 Fix double `/api` prefix

- **Option A (recommended):** Change the fallback in all 5 frontend pages from `'/api'` to `''`, and keep the `/api/` in each fetch URL.
- **Option B:** Create a shared `src/utils/api.js` with a pre-configured axios instance (`baseURL: '/api'`), import it everywhere.
- Pick one approach and apply consistently across `AdminDashboard.jsx`, `Projects.jsx`, `ProjectDetail.jsx`, `AdminLogin.jsx`, `AdminSettings.jsx`.

### 1.2 Fix duplicate navbars

- Remove the inline `<nav>` elements from `Projects.jsx` and `About.jsx`.
- Rely solely on the global `<Navbar />` rendered by `App.jsx`.
- Ensure the shared Navbar has proper responsive design (mobile hamburger — see Phase 2).

### 1.3 Fix port mismatch

- Standardize on a single backend port (recommend 3001 to match render.yaml and vite proxy).
- Update `backend/.env` to `PORT=3001`.
- Verify vite proxy config matches.

### 1.4 Fix `seed.js` duplication

- Remove the second duplicate seed routine (lines ~127-209).
- Keep one clean seed function.

---

## Phase 2: Security Hardening (Day 1-2)

Goal: Make the app secure enough for public deployment.

### 2.1 Fix auth endpoint

- Use generic error messages: "Invalid credentials" for both wrong username and wrong password.
- Remove verbose debug logging of expected username, password length, payload keys.
- Remove frontend `console.log` of login credentials/response in `AdminLogin.jsx`.

### 2.2 Guard public projects endpoint against bad tokens

- Wrap `jwt.verify` in its own try/catch inside `GET /api/projects` so a malformed token falls back to published-only instead of 500ing.

### 2.3 Add auth to `GET /api/projects/:id`

- Require JWT for the single-project-by-ID route (used by admin editing).

### 2.4 Restrict CORS

- Configure `cors()` to only allow the production frontend domain (and localhost in dev).
- Example: `cors({ origin: [process.env.CLIENT_URL || 'http://localhost:5173'] })`.

### 2.5 Add rate limiting to login endpoint

- Install `express-rate-limit`.
- Apply to `POST /api/admin/login` (e.g., 5 attempts per 15 minutes per IP).

### 2.6 Harden admin credentials

- Move admin credentials to environment variables at minimum.
- Better: store admin users in MongoDB with proper bcrypt hashing.
- At minimum, change the default password from `admin123`.

### 2.7 Remove PII logging from contact endpoint

- Remove `console.log` of name/email/message in `POST /api/contact`.

---

## Phase 3: React & UX Fixes (Day 2-3)

Goal: Fix React anti-patterns and improve user experience.

### 3.1 Fix React keys

- `Projects.jsx:150` — Change `key={project.id}` to `key={project._id}`.
- `AdminDashboard.jsx:455` — Avoid `key={index}`, use a unique identifier.

### 3.2 Add mobile navigation

- Add a hamburger menu toggle to `Navbar.jsx`.
- Use React state to show/hide the nav links on mobile.

### 3.3 Add shared API config module

- Create `src/utils/api.js` with a single axios instance:
  ```js
  import axios from 'axios';
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
  export default api;
  ```
- Replace all 5 duplicated `apiUrl` declarations with imports.

### 3.4 Add AbortControllers

- Use `AbortController` in `useEffect` cleanup for all fetch calls in `Projects.jsx`, `ProjectDetail.jsx`, `AdminDashboard.jsx`.

### 3.5 Replace `alert()`/`confirm()` in admin

- Use inline confirmation UI or a toast/notification library (e.g., `react-hot-toast`).

### 3.6 Fix brand name inconsistency

- Update footers in `Home.jsx`, `Projects.jsx`, `About.jsx` from `ExpertMinimalist` to `benjieDev`.
- Remove the dead `/resume.pdf` link.

### 3.7 Remove decorative "Remember me" checkbox

- Either implement it (persist login state) or remove it from `AdminLogin.jsx`.

### 3.8 Fix unused imports

- Remove unused `React` imports from `App.jsx`, `Home.jsx`, `About.jsx`, `ThemeContext.jsx`.
- Remove unused `Link` import from `Projects.jsx`.

---

## Phase 4: Documentation & Cleanup (Day 3)

Goal: Documentation matches reality, codebase is clean.

### 4.1 Rewrite AGENTS.md

- Update to reflect actual stack: Vite, React 19, JSX, Express, Mongoose, MongoDB.
- Remove references to drizzle, BetterAuth, TypeScript, shadcn, Next.js.

### 4.2 Rewrite DESIGN.md

- Document the actual design system: Tailwind v4 `@theme` tokens, hex colors, Inter/JetBrains Mono fonts, Material Symbols icons, `.glass-card`/`.glass-panel` components.
- Remove oklch tokens, Geist fonts, shadcn component conventions.

### 4.3 Fix README.md

- Update directory structure to reflect actual files.
- Update tech stack to React 19 (not 18).
- Remove references to non-existent files (`routes/`, `Footer.jsx`, `ProtectedRoute.jsx`, etc.).
- Fill in or remove the blank "Default Admin Credentials" section.
- Fix or remove `npm run dev:full` script reference.
- Remove the backend build script reference.

### 4.4 Clean up dead files

- Delete `src/App.css` (unused).
- Delete `public/vite.svg` (boilerplate).
- Remove duplicate `.glass-panel` definition in `index.css`.

### 4.5 Remove fake analytics

- Either remove the "System Overview" section from `AdminDashboard.jsx` or replace with real computed data (project count, etc.).

---

## Phase 5: Quality & Architecture (Day 3-5)

Goal: Improve code organization, testability, and maintainability.

### 5.1 Add backend linting

- Add ESLint config for the backend.
- Fix any issues found.

### 5.2 Add basic tests

- Add backend API tests using `supertest` (already installed).
- Test key endpoints: login, CRUD projects, auth guards.
- Add `test` script to `backend/package.json`.

### 5.3 Refactor backend structure

- Extract routes into separate files (`routes/projects.js`, `routes/admin.js`, `routes/contact.js`).
- Extract middleware into `middleware/` directory.
- Extract config into `config/` directory.
- Add central Express error handler.

### 5.4 Refactor frontend components

- Break `AdminDashboard.jsx` (509 lines) into smaller components.
- Create `components/ProjectCard.jsx` for reuse.
- Create `components/Footer.jsx` to replace duplicated footers.
- Create `components/ProtectedRoute.jsx` for auth guards.
- Consider an `AuthContext` for shared auth state.

### 5.5 Consolidate styling

- Choose a primary styling approach (Tailwind + minimal custom CSS).
- Remove or consolidate legacy CSS files.
- Unify on one CSS variable system.

---

## Execution Order

| Phase | Priority | Effort | Impact |
|---|---|---|---|
| Phase 1: Critical Fixes | 🔴 Must do | ~2 hours | App actually works |
| Phase 2: Security | 🔴 Must do | ~3 hours | Safe to deploy |
| Phase 3: React & UX | 🟡 Should do | ~4 hours | Good user experience |
| Phase 4: Documentation | 🟢 Nice to have | ~2 hours | Maintainable project |
| Phase 5: Architecture | 🟢 Nice to have | ~6 hours | Scalable codebase |

**Total estimated effort:** ~17 hours

---

## Decisions

1. **Backend port:** 3001 — matches vite proxy and render.yaml.
2. **Admin auth:** Real DB-persisted users — implement proper admin collection in MongoDB with bcrypt.
3. **Contact form:** Email with nodemailer — send contact submissions as emails.
4. **Admin analytics:** Compute real stats — show actual project count, published vs draft, etc.
5. **Portfolio content:** Replace with real data — user will provide actual project details.

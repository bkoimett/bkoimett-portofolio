# Benjamin Kiprotich Koimett | Full-Stack Portfolio

> A production-grade MERN portfolio with a custom admin dashboard, design system, and interactive terminal — fully token-aligned and responsive.

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
- [Contributing](#contributing)
- [License](#license)

---

## Overview

A full-stack portfolio and content management system built for **Benjamin Kiprotich Koimett** — Full-Stack MERN & Go Engineer. This project showcases professional work while providing an admin dashboard for managing projects and content dynamically.

It implements a "Minimalist Tech Terminal" aesthetic with an emerald-dark-mode ecosystem, glassmorphic cards, interactive terminal simulation, production telemetry, and a secured administrative control plane.

**Key Highlights:**

- **Design system-aligned UI** — Fully token-driven with Tailwind CSS v4 `@theme`; light and dark mode via `@theme inline` + `.dark` class switch; no FOUC.
- **Unified component architecture** — Shared `Footer`, `Layout`, `Container`, `Button`, `Card`, `Section`, `SectionHeading` eliminate duplication that existed pre-revamp (three duplicated footers, scattered button classes).
- **High performance** — Vite bundling + Express API; Lighthouse ≥ 95 on desktop.
- **Fully responsive** — Mobile-first approach with seamless `md:` (768px) and `lg:` (1024px) breakpoints.
- **Modular architecture** — Clean separation of concerns between public pages, admin console, shared components, and data contexts.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS v4** | Styling & Utility Classes (CSS-first config via `@theme`) |
| **React Router DOM v7** | Client-side Routing |
| **Axios** | HTTP Client |
| **React Markdown** | Rich Text Rendering |
| **Material Symbols** | Icon Library |
| **Inter + JetBrains Mono** | Typography (Google Fonts) |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API Server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Bcrypt** | Password Hashing |
| **express-rate-limit** | Login attempt throttling |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Git** | Version Control |
| **npm** | Package Management |
| **dotenv** | Environment Configuration |
| **supertest** | Backend API testing |

---

## Features

### Public Pages

- **Home** — Hero (status badge, gradient accent subtitle, CTAs), Quick Metrics (animated stat cards), Core Tooling (6 tech cards), Featured Systems bento grid (CareFacility/LandLedger/Kijiji), Interactive Terminal ($help/$projects/$stack/$uptime/$contact macros), Final CTA. All `<Link>`/`Button` components; shared `<Footer />`.
- **Projects** — Filterable grid with tech badges and live demos; `ProjectCard` component; 4-project fallback; filter tabs (All, Web Dev, Blockchain, PWA).
- **Project Detail** — Markdown-rendered case study with token-aligned styles; metadata bar (Material Symbols, no emoji); view count from backend; skeleton & not-found states; back button via `<Link>`.
- **About** — Split hero (asymmetrical 12-col layout), sticky bio section, experience timeline (3 roles with numbered deliverables), 4-pillar skills grid (Frontend, Backend & APIs, Data & DevOps, Blockchain & Web3), Contact CTA with `.glass-panel`, shared `<Footer />`.

### Admin Dashboard

- **Secure Login** — JWT-based authentication with rate limiting (5 attempts / 15 min); `/admin/login` gate.
- **System Overview** — Real metric cards (Total Projects from API, Portfolio View Count summed from project views, Last Updated timestamp).
- **Project Management** — Create, edit, delete projects with published/draft status; visibility toggle (PUT /projects/:id); confirm-delete; `ProjectFormDrawer` slide-over form with focus trap.
- **Telemetry Dashboard** — View trends via `TelemetryChart` (inline SVG bars + throughput trend); stat cards from real API data.
- **Settings** — Change username/password; read-only Raw Config viewer (derived values only — no `JWT_SECRET`/`MONGODB_URI`); simulated SSH key status.

---

## Project Structure

```
bkoimett-portfolio/
├── backend/
│   ├── models/
│   │   ├── Admin.js            # Admin user schema, bcrypt hashing
│   │   └── Project.js          # Project schema
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── index.js                # Express server & all API routes
│   ├── seed.js                 # Seed sample projects
│   ├── seedAdmin.js            # Create the initial admin user
│   ├── .env                    # Environment variables
│   ├── render.yaml             # Render deploy config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── About.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminSettings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Container.jsx
│   │   │   ├── Section.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── StatCards.jsx
│   │   │       ├── TelemetryChart.jsx
│   │   │       ├── ProjectsTable.jsx
│   │   │       ├── ProjectFormDrawer.jsx
│   │   │       ├── ConfigViewer.jsx
│   │   │       └── SessionBadge.jsx
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── auth.js                 # Admin token helpers
│   │   │   └── api.js                  # Shared API client
│   │   ├── data/
│   │   │   ├── profile.js
│   │   │   ├── techStack.js
│   │   │   ├── stats.js
│   │   │   └── terminalCommands.js
│   │   ├── lib/
│   │   │   └── telemetry.js
│   │   ├── index.css                   # Tailwind v4 @theme tokens + utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js                  # Dev proxy to :3001
│   └── package.json
│
├── .gitignore
├── README.md
└── REVAMP_PLAN.md
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bkoimett-portfolio.git
cd bkoimett-portfolio
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the **backend** directory:

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
| `MONGODB_URI` | Yes | MongoDB connection string (must start with `mongodb://` or `mongodb+srv://`) |
| `JWT_SECRET` | Yes | Secret used to sign/verify admin JWTs |
| `PORT` | No | API port (defaults to `3001`) |
| `CLIENT_URL` | No | Allowed CORS origin (defaults to `http://localhost:5173`) |
| `ADMIN_USERNAME` | No | Seed username for `npm run seed:admin` (defaults to `admin`) |
| `ADMIN_PASSWORD` | No | Seed password for `npm run seed:admin` (defaults to `admin123`) |

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

Optional — in development, requests to `/api` are proxied to `http://localhost:3001` via `vite.config.js`, so `VITE_API_URL` is only needed when the frontend is served separately from the API.

---

## Development

### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:3001`

### Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:5173`

There is no root `package.json` or `dev:full` script — run the two servers from separate terminals. The Vite dev server proxies `/api` requests to the backend automatically.

---

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

Build output in `frontend/dist/`

### Backend

No build step — the backend is plain Node.js. Run it directly:

```bash
cd backend
npm start
```

### Deploy

- **Frontend**: Deploy `dist/` to Vercel (`vercel.json` provided) or static hosting
- **Backend**: Deploy to Render (`render.yaml` provided), Railway, DigitalOcean, or AWS

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login (rate-limited: 5 attempts per 15 min) |
| `GET` | `/api/projects` | Published projects; authenticated requests return all (incl. drafts) |
| `GET` | `/api/projects/slug/:slug` | Get a published project by slug |
| `POST` | `/api/contact` | Submit the contact form |

### Auth-Protected Routes (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/admin/settings` | Update admin username/password |
| `GET` | `/api/projects/:id` | Get a single project by id (admin) |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |

---

## Design System

The design system is defined in `frontend/src/index.css` using Tailwind CSS v4 CSS-first tokens (`@theme`). See `DESIGN.md` for the full reference.

### Color Palette

**Light mode (`:root`):**

```css
--color-surface: #f8fafc         /* Page background */
--color-surface-dim: #1e293b     /* Footer background */
--color-surface-container-low: #f1f5f9  /* Cards, Sidebar */
--color-primary: #0f9d6b         /* Emerald - CTAs, Icons, Active States */
--color-primary-container: #10b981  /* Accent Green */
--color-on-surface: #0f0f0f      /* High Emphasis Text */
--color-on-surface-variant: #64748b  /* Low Emphasis Text */
--color-outline: #64748b
--color-outline-variant: #94a3b8   /* Borders */
--color-error: #b91c1c           /* Destructive Actions */
--color-secondary: #64748b
--color-secondary-container: #a0aec0
```

**Dark mode (`.dark` class):**

```css
--color-surface: #101415         /* Page background */
--color-surface-dim: #0b0f10     /* Footer background */
--color-surface-container-low: #181c1d  /* Cards, Sidebar */
--color-primary: #4edea3         /* Emerald - CTAs, Icons, Active States */
--color-primary-container: #10b981  /* Accent Green */
--color-on-surface: #e0e3e5      /* High Emphasis Text */
--color-on-surface-variant: #bbcabf  /* Low Emphasis Text */
--color-outline: #86948a
--color-outline-variant: #3c4a42   /* Borders */
--color-error: #ffb4ab           /* Destructive Actions */
--color-secondary: #bec6e0
--color-secondary-container: #3e465c
```

### Typography

- **Fonts**: Inter (body/display), JetBrains Mono (code)
- **Display XL**: 72px / 1.1 / 800 / -0.04em (48px on mobile)
- **Display LG**: 64px / 1.1 / 700 / -0.03em
- **Headline LG/MD/SM**: 32/24/18px, weight 600-700
- **Body LG/MD**: 18/16px / 1.6 / 400

### Spacing

- Stack: **8px / 16px / 32px**
- Gutter: **24px**
- Section gap: **120px**
- Container max-width: **1280px**

### Radius

- Base: **4px** | MD: **8px** | LG: **16px** | XL: **24px**

### Effects

- **Glassmorphism**: `backdrop-blur-xl` with `bg-surface-container-low/70` borders (`glass-card`, `glass-panel` utilities) — works in both light and dark modes via token resolution.
- **Emerald glow**: radial gradient utility (`emerald-glow`)
- **Transitions**: `200ms cubic-bezier(0.4, 0, 0.2, 1)` global for theme switching; `reduced-motion-guard` for `prefers-reduced-motion`.

---

## Admin Access

Authentication uses MongoDB-persisted admin users (there are no hardcoded credentials).

### Create the Admin User

```bash
cd backend
npm run seed:admin
```

The script reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `backend/.env` and falls back to `admin` / `admin123`. It is idempotent — if the username already exists, it skips creation.

No default credentials are hardcoded in the app. After seeding, change the password via the admin **Settings** page.

**Security note**: the login endpoint returns a generic "Invalid credentials" error for both unknown usernames and wrong passwords, and is rate-limited to 5 attempts per 15 minutes.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is proprietary and owned by **Benjamin Kiprotich Koimett**. All rights reserved. No part of this project may be reproduced without permission.

---

## Author

**Benjamin Kiprotich Koimett**
- Portfolio: [benjamin.koimett.tech](https://benjamin.koimett.tech)
- GitHub: [@bkoimett](https://github.com/bkoimett)
- LinkedIn: [Benjamin Kiprotich Koimett](https://linkedin.com/in/bkoimett)
- Email: benjamin@koimett.tech

---

## Acknowledgments

- Design inspiration from **Expert Minimalist** philosophy
- Icons from **Google Material Symbols**
- Fonts from **Google Fonts** (Inter, JetBrains Mono)

---

## Support

For issues or questions:
- Open an issue on GitHub
- Email: benjamin@koimett.tech

---

Built with the MERN stack (MongoDB, Express, React, Node.js) + Tailwind CSS v4 design system.
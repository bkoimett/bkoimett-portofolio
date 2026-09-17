# Benjamin Kiprotich Koimett | Full-Stack Portfolio

[![Tech Stack](https://shields.io)](https://react.dev)
[![React Version](https://shields.io)](https://react.dev)
[![Tailwind Version](https://shields.io)](https://tailwindcss.com)
[![License](https://shields.io)](LICENSE)

Welcome to the source code of my personal full-stack software engineering portfolio and content management system (CMS). This production-grade application showcases my professional engineering work, open-source projects, and technical skills while providing a secure administrative interface to manage content dynamically.

> 🌐 **Live Demo:** [https://bkoimett-portofolio.vercel.app/]
> 📊 **Admin Portal:** [https://bkoimett-portofolio.vercel.app/admin/login]

---

## 🚀 Key Highlights

*   **Modern Frontend:** Built with **React 19** and compiled using **Vite** for near-instant loading speeds.
*   **Next-Gen Styling:** Uses the brand new **Tailwind CSS v4** featuring a CSS-first custom theme config and a sleek, dark-mode glassmorphic design.
*   **Robust Backend:** Powered by **Node.js** and **Express** with a modular REST API architecture.
*   **Secure Administration:** Protected by JSON Web Tokens (**JWT**), **Bcrypt** password hashing, and login rate-limiting to prevent brute-force attacks.
*   **Rich Content Editing:** Supports **Markdown rendering** for project case studies, allowing rich text formatting directly from the dashboard.

---

## 📋 Table of Contents

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

### Key Highlights

- **Expert Minimalist Design** — Clean, professional UI with glassmorphism effects
- **Secure Admin Dashboard** — Manage projects, update settings
- **High Performance** — Vite bundling + Express API
- **Fully Responsive** — Mobile-first approach with seamless breakpoints
- **Modular Architecture** — Clean separation of concerns

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
| **Nodemailer** | Contact form delivery (reserved for Phase 2) |

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
- **Home** — Hero section, tech stack, featured works
- **Projects** — Filterable grid with tech badges and live demos
- **About** — Bio, skills grid, contact CTA
- **Project Detail** — Deep dive with markdown content, images, and links

### Admin Dashboard
- **Secure Login** — JWT-based authentication with rate limiting (5 attempts / 15 min)
- **System Overview** — Published/draft project stats
- **Project Management** — Create, edit, delete projects with published/draft status
- **Settings** — Update username and password

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
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── themeContext.js         # Theme context definition
│   │   │   └── ThemeContext.jsx        # Theme provider (dark/light)
│   │   ├── utils/
│   │   │   └── auth.js                 # Admin token helpers
│   │   ├── styles/                     # Page-level CSS
│   │   ├── index.css                   # Tailwind v4 @theme tokens + utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js                 # Dev proxy to :3001
│   └── package.json
│
├── .gitignore
└── README.md
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
Create a `.env` file in the **backend** directory (see [Environment Variables](#environment-variables)).

---

## Environment Variables

### Backend (`backend/.env`)
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

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001
```
Optional — in development, requests to `/api` are proxied to `http://localhost:3001` via `vite.config.js`, so `VITE_API_URL` is only needed when the frontend is served separately from the API. When set, the shared API client (`frontend/src/utils/api.js`) appends `/api` to it, so `http://localhost:3001` resolves to `http://localhost:3001/api` (if it already ends in `/api`, it is used as-is).

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
```css
--color-surface:                #101415  /* Main Background */
--color-surface-container-low:  #181c1d  /* Cards, Sidebar */
--color-primary:                #4edea3  /* Emerald - CTAs, Icons, Active States */
--color-primary-container:      #10b981  /* Accent Green */
--color-on-surface:             #e0e3e5  /* High Emphasis Text */
--color-on-surface-variant:     #bbcabf  /* Low Emphasis Text */
--color-outline:                #86948a
--color-outline-variant:        #3c4a42  /* Borders */
--color-error:                  #ffb4ab  /* Destructive Actions */
--color-secondary:              #bec6e0
--color-secondary-container:    #3e465c
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
- **Glassmorphism**: `backdrop-blur-xl` with `bg-black/40` borders (`glass-card`, `glass-panel` utilities)
- **Emerald glow**: radial gradient utility (`emerald-glow`)
- **Transitions**: `200ms cubic-bezier(0.4, 0, 0.2, 1)` global for theme switching

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

This project is proprietary and owned by **Benjamin Kiprotich Koimett**.  
All rights reserved. No part of this project may be reproduced without permission.

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

Built with the MERN stack (MongoDB, Express, React, Node.js).

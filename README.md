# 🚀 Benjamin Kiprotich Koimett | Full-Stack Portfolio

> **Expert Minimalist** — A production-grade MERN portfolio with admin dashboard, Go backend, and elegant design system.

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

## 📖 Overview

A full-stack portfolio and content management system built for **Benjamin Kiprotich Koimett** — Full-Stack MERN & Go Engineer. This project showcases professional work while providing an admin dashboard for managing projects, skills, and content dynamically.

### Key Highlights

- 🎨 **Expert Minimalist Design** — Clean, professional UI with glassmorphism effects
- 🔐 **Secure Admin Dashboard** — Manage projects, view analytics, update settings
- ⚡ **High Performance** — Vite frontend + Go/MongoDB backend
- 📱 **Fully Responsive** — Mobile-first approach with seamless breakpoints
- 🧩 **Modular Architecture** — Clean separation of concerns

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling & Utility Classes |
| **React Router DOM** | Client-side Routing |
| **Axios** | HTTP Client |
| **React Markdown** | Rich Text Rendering |
| **Material Symbols** | Icon Library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API Server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Multer** | File Uploads |
| **Bcrypt** | Password Hashing |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Git** | Version Control |
| **npm** | Package Management |
| **dotenv** | Environment Configuration |

---

## ✨ Features

### Public Pages
- ✅ **Home** — Hero section, quick stats, technical stack, featured works
- ✅ **Projects** — Filterable grid with tech badges and live demos
- ✅ **About** — Bio, experience timeline, skills grid, contact CTA
- ✅ **Project Detail** — Deep dive with markdown content, images, and links

### Admin Dashboard
- 🔐 **Secure Login** — JWT-based authentication
- 📊 **System Overview** — Real-time project stats and analytics
- 📝 **Project Management** — Create, edit, delete projects with snapshots
- ⚙️ **Settings** — Update profile, security credentials
- 📈 **Audit Trail** — Last updated timestamps

---

## 📁 Project Structure

```
bkoimett-portfolio/
├── backend/
│   ├── models/
│   │   ├── Project.js          # Project schema
│   │   └── Admin.js            # Admin user schema
│   ├── routes/
│   │   ├── projects.js         # CRUD endpoints
│   │   └── admin.js            # Auth & settings
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   └── server.js               # Entry point
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
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── index.css           # Tailwind + custom styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env                        # Environment variables
├── .gitignore
├── package.json                # Root workspace
└── README.md                   # You are here
```

---

## 💻 Installation & Setup

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
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env` file in the **frontend** directory:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Development

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:5000`

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
App runs at `http://localhost:5173`

### Run Both (Root Directory)
```bash
# Install concurrently if not already
npm install -g concurrently

# Run both servers
npm run dev:full
```

---

## 🏗️ Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```
Build output in `frontend/dist/`

### Build Backend
```bash
cd backend
npm run build
```

### Deploy
- **Frontend**: Deploy `dist/` folder to Vercel, Netlify, or static hosting
- **Backend**: Deploy to Heroku, Railway, DigitalOcean, or AWS

---

## 🌐 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all projects |
| `GET` | `/api/projects/:slug` | Get single project by slug |
| `GET` | `/api/projects/category/:category` | Filter projects by category |

### Admin Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/admin/verify` | Verify JWT token |
| `POST` | `/api/admin/projects` | Create new project |
| `PUT` | `/api/admin/projects/:id` | Update project |
| `DELETE` | `/api/admin/projects/:id` | Delete project |
| `PUT` | `/api/admin/settings` | Update admin settings |
| `POST` | `/api/admin/upload` | Upload project snapshot |

---

## 🎨 Design System

### Color Palette
```css
--primary: #10b981        /* Emerald - CTAs, Icons, Active States */
--surface: #101415        /* Main Background */
--surface-low: #181c1d    /* Cards, Sidebar */
--text-primary: #e0e3e5   /* High Emphasis Text */
--text-secondary: #bbcabf /* Low Emphasis Text */
--outline: #3f4946        /* Borders */
--error: #ffb4ab          /* Destructive Actions */
```

### Typography
```css
--font-display: Inter 800, 72px, 1.1 LH
--font-headline: Inter 700, 32px, 1.2 LH
--font-body: Inter 400, 16px, 1.6 LH
--font-code: JetBrains Mono 500, 14px, 1.0 LH
```

### Spacing
- Base unit: **8px**
- Container max-width: **1280px**
- Gutter: **24px** (Desktop), **16px** (Mobile)
- Section gap: **120px** (Desktop), **64px** (Mobile)

### Effects
- **Glassmorphism**: `backdrop-filter: blur(12px)` with `rgba(16, 20, 21, 0.4)`
- **Transitions**: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Shadows**: `0 20px 40px rgba(0, 0, 0, 0.4)`

---

## 🔐 Admin Access

### Default Admin Credentials


### Creating an Admin User
```bash
cd backend
node scripts/createAdmin.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use **ESLint** for JavaScript/React
- Use **Prettier** for formatting
- Follow **BEM** naming for custom CSS
- Use **Tailwind** classes over custom CSS when possible

---

## 📄 License

This project is proprietary and owned by **Benjamin Kiprotich Koimett**.  
All rights reserved. No part of this project may be reproduced without permission.

---

## 👤 Author

**Benjamin Kiprotich Koimett**
- Portfolio: [benjamin.koimett.tech](https://benjamin.koimett.tech)
- GitHub: [@bkoimett](https://github.com/bkoimett)
- LinkedIn: [Benjamin Kiprotich Koimett](https://linkedin.com/in/bkoimett)
- Email: benjamin@koimett.tech

---

## 🙏 Acknowledgments

- Design inspiration from **Expert Minimalist** philosophy
- Icons from **Google Material Symbols**
- Fonts from **Google Fonts** (Inter, JetBrains Mono)

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: benjamin@koimett.tech
- Phone: +254 722 970 951

---

**Built with ❤️ using MERN & Go**

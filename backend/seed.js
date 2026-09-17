const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Project schema
const projectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  content: String,
  category: String,
  image: String,
  technologies: [String],
  tags: [String],
  readTime: String,
  publishDate: String,
  github: String,
  demo: String,
  highlights: [String],
  status: String
});

const Project = mongoose.model('Project', projectSchema);

const projects = [
  {
    slug: 'carefacility-platform',
    title: 'CareFacility Platform',
    description: 'Full-stack healthcare management system serving The Serenity Place rehabilitation center. Manages resident records, sponsors, automated payments, billing, debt tracking, and staff workflows.',
    content: '## CareFacility Platform\n\nA production healthcare management system deployed for The Serenity Place rehabilitation center. Built to run live administrative operations including resident care tracking, financial management, and staff coordination.\n\n### Key Features\n\n- **Resident records** — Structured care documentation for every resident\n- **Sponsor & payment automation** — Automated billing with balance calculations\n- **Debt tracking** — Clear visibility into outstanding balances\n- **Staff workflows** — Role-based operations for care teams\n- **Real-time admin dashboard** — Balance calculations, payment reminders, and notifications\n\n### Technical Implementation\n\nBuilt on the MERN stack with PostgreSQL for relational care records. Deployed on Vercel (frontend) and Render (backend) with TypeScript throughout for type safety across the application boundary.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format',
    technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
    tags: ['healthcare', 'mern', 'payments', 'typescript'],
    readTime: '7 min read',
    publishDate: '2025-06-15',
    github: 'https://github.com/bkoimett/carefacility',
    demo: 'https://theserenityplace.vercel.app',
    highlights: [
      'Real-time admin dashboard with balance calculations and payment reminders',
      'Automated billing, debt tracking, and sponsor management',
      'Production deployment serving a live rehabilitation center'
    ],
    status: 'published'
  },
  {
    slug: 'landledger',
    title: 'LandLedger — Blockchain Title Deed Verification',
    description: 'Immutable title deed verification platform preventing land fraud across East Africa. Secure document submission, blockchain verification, and permanent ownership records.',
    content: '## LandLedger\n\nA blockchain-backed title deed verification platform designed to prevent land fraud across East Africa by creating immutable, publicly verifiable ownership records.\n\n### Key Features\n\n- **Secure document submission** — Title deeds uploaded and anchored on-chain\n- **Blockchain verification** — Tamper-proof ownership history\n- **Immutable ownership records** — Permanent, auditable title history\n- **Public-sector ready** — Designed for integration with land registries\n\n### Technical Implementation\n\nTypeScript frontend with a Golang backend, smart contracts deployed on Solana and Poly Amoy. Optimized for the composed-blockchain realities of land-governance deployment.',
    category: 'Blockchain',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format',
    technologies: ['TypeScript', 'Golang', 'Solana', 'Smart Contracts'],
    tags: ['blockchain', 'solana', 'land', 'golang'],
    readTime: '6 min read',
    publishDate: '2025-09-10',
    github: 'https://github.com/bkoimett/land-ledge',
    highlights: [
      'Immutable title deed verification on Solana & Poly Amoy',
      'Designed to prevent land fraud across East Africa',
      'Public-sector deployment ready'
    ],
    status: 'published'
  },
  {
    slug: 'the-serenity-place',
    title: 'The Serenity Place — Rehabilitation Center Website',
    description: 'Public-facing website for The Serenity Place with blog, service portfolio, gallery, and contact systems. Includes an admin dashboard for content management.',
    content: '## The Serenity Place\n\nPublic-facing website for a rehabilitation center, running in 24/7 production on Vercel. Combines a polished brand presence with practical content management.\n\n### Key Features\n\n- **Blog & articles** — Recovery stories and clinical updates\n- **Service portfolio** — Program offerings and care paths\n- **Gallery** — Facility and community imagery\n- **Contact systems** — Admissions inquiries and support\n- **Admin dashboard** — Content management for the care team\n\n### Technical Implementation\n\nNext.js with Tailwind CSS deployed on Vercel. Prioritized performance, accessibility, and effortless content updates for non-technical staff.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&auto=format',
    technologies: ['Next.js', 'Tailwind CSS'],
    tags: ['nextjs', 'tailwind', 'healthcare', 'blog'],
    readTime: '5 min read',
    publishDate: '2025-03-01',
    demo: 'https://www.theserenityplace.org',
    highlights: [
      '24/7 production uptime on Vercel',
      'Blog, service portfolio, gallery, and contact systems',
      'Admin dashboard for content management'
    ],
    status: 'published'
  },
  {
    slug: 'kijiji-corporate-cuisine',
    title: 'Kijiji Corporate Cuisine — Food Blog Platform',
    description: 'Responsive food blog platform with an admin dashboard for content management. Built for mobile and desktop with a clean editorial experience.',
    content: '## Kijiji Corporate Cuisine\n\nA food blog platform featuring a responsive design for mobile and desktop, with a fully managed admin dashboard for publishing content.\n\n### Key Features\n\n- **Responsive editorial layout** — Optimized for mobile and desktop\n- **Admin dashboard** — Content publishing and management\n- **Media-rich posts** — Recipe and culinary features\n\n### Technical Implementation\n\nBuilt with React and Node.js. Focused on fast page loads and a smooth reading experience across devices.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format',
    technologies: ['React', 'Node.js'],
    tags: ['food', 'blog', 'react', 'content'],
    readTime: '4 min read',
    publishDate: '2024-11-20',
    demo: 'https://www.kijijicorporatecuisine.co.ke',
    highlights: [
      'Responsive design for mobile and desktop',
      'Admin dashboard for content publishing',
      'Live production deployment'
    ],
    status: 'published'
  },
  {
    slug: 'task-mix',
    title: 'Task-Mix — PWA Task Platform',
    description: 'Progressive web app enabling youth to discover and complete short tasks. Features offline capability and a badge-based engagement system.',
    content: '## Task-Mix\n\nA progressive web app built to help youth discover and complete short tasks, with offline capability and a badge-based engagement system to drive consistency.\n\n### Key Features\n\n- **Offline capability** — Works without a stable connection\n- **Badge-based engagement** — Reward system for completed tasks\n- **Task discovery** — Curated short tasks for youth\n\n### Technical Implementation\n\nBuilt as a solo project with Vite on the frontend and Golang on the backend.',
    category: 'PWA',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format',
    technologies: ['Vite', 'Golang'],
    tags: ['pwa', 'golang', 'offline'],
    readTime: '4 min read',
    publishDate: '2025-04-05',
    highlights: [
      'Progressive web app with offline support',
      'Badge-based engagement system',
      'Solo project: Vite + Golang'
    ],
    status: 'published'
  },
  {
    slug: 'collaborative-markdown-editor',
    title: 'Real-Time Collaborative Markdown Editor',
    description: 'CRDT-based collaborative markdown editor with low-latency WebSocket synchronization for reliable concurrent editing.',
    content: '## Real-Time Collaborative Markdown Editor\n\nA collaborative markdown editing tool using CRDT-based synchronization for reliable concurrent editing with low-latency communication.\n\n### Key Features\n\n- **CRDT-based sync** — Conflict-free concurrent editing\n- **Low-latency WebSocket** — Real-time updates between peers\n- **Markdown-first** — Clean authoring experience\n\n### Technical Implementation\n\nVite frontend with a Golang backend using WebSocket communication. Focused on correctness under concurrency and minimal sync latency.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1618389041494-8fab89c3f22b?w=600&auto=format',
    technologies: ['Vite', 'Golang', 'WebSocket'],
    tags: ['collaboration', 'websocket', 'crdt', 'golang'],
    readTime: '5 min read',
    publishDate: '2025-08-12',
    highlights: [
      'CRDT-based sync for conflict-free concurrent editing',
      'Low-latency WebSocket communication',
      'Vite + Golang architecture'
    ],
    status: 'published'
  },
  {
    slug: 'flasnotes',
    title: 'FlashNotes — AI Flashcard Generator',
    description: 'AI-powered study assistant that generates flashcards with adaptive learning workflows. Co-developed the frontend.',
    content: '## FlashNotes\n\nAn AI-powered flashcard generator and study assistant with adaptive learning workflows. Co-developed the frontend experience.\n\n### Key Features\n\n- **AI flashcard generation** — Convert study material into flashcards\n- **Adaptive learning** — Spaced repetition tuned to progress\n- **Clean study UX** — Focused, distraction-free interface\n\n### Technical Implementation\n\nReact frontend with a Golang backend. The AI layer generates structured study content from raw input material.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format',
    technologies: ['React', 'Golang'],
    tags: ['ai', 'edtech', 'react', 'golang'],
    readTime: '5 min read',
    publishDate: '2025-10-01',
    github: 'https://github.com/petraclara/FlashNotes',
    highlights: [
      'AI-powered flashcard generation',
      'Adaptive learning workflows',
      'Co-developed frontend'
    ],
    status: 'published'
  },
  {
    slug: 'agrisync',
    title: 'AgriSync — Offline-First Farming PWA',
    description: 'Offline-first farming PWA for low-connectivity regions with offline learning modules and FAO data integration.',
    content: '## AgriSync\n\nAn offline-first farming PWA built for low-connectivity regions, providing accessible learning modules and agricultural data for farmers.\n\n### Key Features\n\n- **Offline learning modules** — Educational content that works without connectivity\n- **FAO data integration** — Trusted agricultural datasets\n- **Low-connectivity optimized** — Designed for rural deployment\n\n### Technical Implementation\n\nFrontend lead for the project; built the UI for reliable operation in areas with poor network coverage.',
    category: 'PWA',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format',
    technologies: ['PWA', 'Offline-first'],
    tags: ['pwa', 'agriculture', 'offline', 'faq'],
    readTime: '5 min read',
    publishDate: '2025-07-18',
    highlights: [
      'Offline-first architecture for low-connectivity regions',
      'FAO data integration',
      'Frontend lead role'
    ],
    status: 'published'
  }
];

async function seed() {
  try {
    // Clear existing projects
    await Project.deleteMany({});
    console.log('Deleted existing projects');

    // Insert new projects
    await Project.insertMany(projects);
    console.log('Seeded projects');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
/* Shown when the API cannot be reached, so the index still reads as a
   registry rather than as an error. Same shape as a fetched record: the
   figure is drawn from the stack, not borrowed from a stock library. */

export const fallbackProjects = [
  {
    _id: 'fallback-1',
    slug: 'carefacility-platform',
    title: 'CareFacility Platform',
    description:
      'Resident, sponsor and payment records for a rehabilitation facility, with balances calculated on the server and alerts when a payment lapses.',
    category: 'Web Dev',
    technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Vite'],
    github: 'https://github.com/bkoimett/carefacility',
    demo: 'https://theserenityplace.vercel.app',
  },
  {
    _id: 'fallback-2',
    slug: 'landledger',
    title: 'LandLedger',
    description:
      'Title deed verification on Solana. Each deed is hashed and anchored so a duplicate sale is visible before the money moves.',
    category: 'Blockchain',
    technologies: ['TypeScript', 'Blockchain', 'Solana', 'Smart Contracts'],
    github: 'https://github.com/bkoimett/land-ledge',
    demo: 'https://land-ledge-git-frontend-benjie-bkoimetts-projects.vercel.app/',
  },
  {
    _id: 'fallback-3',
    slug: 'argus',
    title: 'Argus',
    description:
      'Run several coding agents at once, walk away, and keep the approvals on your phone. One event log for everything every agent did.',
    category: 'Dev Tooling',
    technologies: ['Go', 'ai-agents', 'agent-orchestration', 'cli'],
    github: 'https://github.com/argus-command-center/argus-command-centre',
    demo: 'https://argus.dev',
  },
  {
    _id: 'fallback-4',
    slug: 'klimatt',
    title: 'Klimatt',
    description:
      'Crop calendars, pest identification and market prices for smallholder farmers, all of it working with the radio off.',
    category: 'PWA',
    technologies: ['TypeScript', 'PWA', 'Offline-first', 'Service Workers'],
    github: 'https://github.com/Geremi57/klimatt',
  },
  {
    _id: 'fallback-5',
    slug: 'collaborative-markdown-editor',
    title: 'Real-Time Collaborative Markdown Editor',
    description:
      'Two people editing one document without a lock and without an argument. CRDT for the merge, Redis for presence.',
    category: 'Backend',
    technologies: ['Go', 'CRDT', 'REST API', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com/bkoimett/collab-tool',
    demo: 'https://collab-tool-frontend.onrender.com',
  },
  {
    _id: 'fallback-6',
    slug: 'detecto',
    title: 'Detecto',
    description:
      'Counts people in a photograph with YOLOv8 and draws the boxes, so a person can check the machine instead of trusting a number.',
    category: 'Web Dev',
    technologies: ['Python', 'FastAPI', 'YOLOv8', 'React'],
    github: 'https://github.com/bkoimett/detecto',
    demo: 'https://frontend-rho-self-41.vercel.app',
  },
  {
    _id: 'fallback-7',
    slug: 'e-commerce',
    title: 'E-Commerce Platform',
    description:
      'Storefront, promotions engine and M-Pesa or card checkout for an electronics retailer, with the payment provider kept behind one interface.',
    category: 'Web Dev',
    technologies: ['TypeScript', 'React', 'Supabase', 'Vercel'],
    github: 'https://github.com/bkoimett/e-commerce',
  },
  {
    _id: 'fallback-8',
    slug: 'opencode-ntfy-approve',
    title: 'OpenCode ntfy Approve',
    description:
      'Sends agent permission requests to your phone with Allow and Reject in the notification itself. Tap to answer, no terminal needed.',
    category: 'Dev Tooling',
    technologies: ['TypeScript', 'ntfy', 'opencode-plugin', 'developer-tools'],
    github: 'https://github.com/bkoimett/opencode-ntfy-approve',
  },
];

export const fallbackBlogs = [
  {
    _id: 'fallback-blog-1',
    slug: 'building-a-portfolio-registry-my-journey-with-open-source-tools',
    title: 'Building a Portfolio Registry: My Journey with Open-Source Tools',
    description:
      'How I structured my public work as a searchable registry of projects, decisions and lessons, from early scripts to the filed system you see today.',
    publishDate: '2026-09-21',
    tags: ['portfolio', 'systems', 'open source'],
    readTime: '8 min read',
    views: 142,
    content: '',
  },
  {
    _id: 'fallback-blog-2',
    slug: 'from-registry-records-to-modern-apis-lessons-learned',
    title: 'From Registry Records to Modern APIs: Lessons Learned',
    description:
      'What a land registry, a patient record system and a farm ledger taught me about designing APIs that survive scale and succession.',
    publishDate: '2026-09-21',
    tags: ['api', 'design', 'backend'],
    readTime: '6 min read',
    views: 89,
    content: '',
  },
];

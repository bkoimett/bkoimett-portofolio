/* global process */
/**
 * Vercel Serverless Function: GET /api/sitemap  → proxied as /sitemap.xml
 *
 * Generates the same dynamic sitemap as backend GET /sitemap.xml,
 * but runs on the frontend domain (https://bkoimett-portofolio.vercel.app/sitemap.xml)
 * so crawlers never need to know the backend host.
 *
 * Reuses existing public APIs: GET /api/projects and GET /api/blogs (filtered to published)
 * No new dependencies, no Mongoose in this function — native fetch only.
 * If the backend is temporarily unavailable, returns a valid XML with only static routes.
 */

const SITE_URL = 'https://bkoimett-portofolio.vercel.app';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toISODate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

function isValidSlug(slug) {
  if (typeof slug !== 'string') return false;
  const s = slug.trim();
  if (!s || s.length < 2 || s.length > 120) return false;
  if (s.includes('..') || s.includes('//') || s.includes(' ')) return false;
  if (/^admin/i.test(s)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(s);
}

function buildSitemapXml({ projects, blogs }) {
  const urls = [];
  urls.push({ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' });
  urls.push({ loc: `${SITE_URL}/projects`, changefreq: 'weekly', priority: '0.9' });
  urls.push({ loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.9' });
  urls.push({ loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.7' });

  const seen = new Set();
  for (const p of projects) {
    if (!p || !isValidSlug(p.slug)) continue;
    const key = `p:${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const lastmod = toISODate(p.updatedAt || p.publishDate || p.createdAt);
    urls.push({
      loc: `${SITE_URL}/projects/${p.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }
  for (const b of blogs) {
    if (!b || !isValidSlug(b.slug)) continue;
    const key = `b:${b.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const lastmod = toISODate(b.updatedAt || b.publishDate || b.createdAt);
    urls.push({
      loc: `${SITE_URL}/blog/${b.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const body = urls
    .map((u) => {
      const lastmodTag = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
      return `  <url><loc>${escapeXml(u.loc)}</loc>${lastmodTag}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function resolveBackendBase() {
  // Prefer explicit env; fallback to known Render host, then localhost for dev
  const candidates = [
    process.env.BACKEND_URL,
    process.env.API_URL,
    process.env.VITE_API_URL,
  ].filter(Boolean);

  for (const raw of candidates) {
    const base = raw.replace(/\/+$/, '').replace(/\/api$/, '');
    if (base && !base.includes('localhost') && base.startsWith('http')) return base;
  }
  // If only localhost candidate exists, use it (local dev)
  for (const raw of candidates) {
    const base = raw.replace(/\/+$/, '').replace(/\/api$/, '');
    if (base) return base;
  }
  // Known production backend (matches PRD/Render)
  return 'https://bkoimett-portofolio.onrender.com';
}

async function fetchJson(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  // Also allow direct /api/sitemap.xml path — same handler
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method Not Allowed');
  }

  const backendBase = resolveBackendBase();
  let projects = null;
  let blogs = null;

  // Try fetching published content from backend public APIs
  // These endpoints already filter to status: 'published' for unauthenticated callers
  const [pRes, bRes] = await Promise.all([
    fetchJson(`${backendBase}/api/projects`),
    fetchJson(`${backendBase}/api/blogs`),
  ]);

  if (Array.isArray(pRes)) projects = pRes;
  if (Array.isArray(bRes)) blogs = bRes;

  // Graceful fallback: if either fetch failed, still emit valid XML with static URLs (or partial data)
  const xml = buildSitemapXml({
    projects: projects || [],
    blogs: blogs || [],
  });

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  // CORS not needed for sitemap but harmless
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(xml);
}

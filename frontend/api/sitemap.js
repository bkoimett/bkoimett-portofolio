/**
 * Vercel Serverless Function: GET /api/sitemap  → proxied as /sitemap.xml
 *
 * Generates the same dynamic sitemap as backend GET /sitemap.xml, but runs on
 * the frontend domain (https://bkoimett-portofolio.vercel.app/sitemap.xml) so
 * crawlers never need to know the backend host.
 *
 * Reads published projects/blogs directly from Supabase (Phase 3) — no Render
 * round-trip. If the query fails, returns a valid XML containing only the
 * static routes so crawlers never break.
 */

import { getAdminClient } from './_lib/supabase.js';

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

// Postgres rows → the { slug, updatedAt, publishDate, createdAt } shape the
// sitemap builder consumes (only the columns it needs are selected).
const toEntry = (row) => ({
  slug: row.slug,
  updatedAt: row.updated_at,
  publishDate: row.publish_date,
  createdAt: row.created_at,
});

async function fetchPublished(type) {
  const { data, error } = await getAdminClient()
    .from(type)
    .select('slug, publish_date, created_at, updated_at')
    .eq('status', 'published');
  if (error) return null;
  return (data || []).map(toEntry);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method Not Allowed');
  }

  let projects = [];
  let blogs = [];
  try {
    const [pResult, bResult] = await Promise.all([fetchPublished('projects'), fetchPublished('blogs')]);
    if (pResult) projects = pResult;
    if (bResult) blogs = bResult;
  } catch {
    projects = [];
    blogs = [];
  }

  const xml = buildSitemapXml({ projects, blogs });

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(xml);
}
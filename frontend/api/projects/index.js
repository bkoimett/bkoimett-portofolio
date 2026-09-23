// GET /api/projects + POST /api/projects
// Mirrors backend GET /api/projects and POST /api/projects.
import { randomUUID } from 'node:crypto';
import { getAdminClient } from '../_lib/supabase.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { generateSlug } from '../_lib/slugs.js';
import { projectFromRow } from '../_lib/serializers.js';
import { sendJson, badRequest, unauthorized, internalError, methodNotAllowed } from '../_lib/http.js';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format';

export default async function handler(req, res) {
  if (req.method === 'GET') return handleList(req, res);
  if (req.method === 'POST') return handleCreate(req, res);
  return methodNotAllowed(res);
}

// Admins (valid JWT) see all records; anonymous visitors see published only.
// Not CDN-cached: a cached admin listing could leak drafts to the public.
async function handleList(req, res) {
  try {
    const admin = verifyAdminToken(req);
    const client = getAdminClient();
    let query = client.from('projects').select('*').order('created_at', { ascending: true });
    if (!admin) query = query.eq('status', 'published');
    const { data, error } = await query;
    if (error) return internalError(res, 'Failed to fetch projects');
    return sendJson(res, 200, (data || []).map(projectFromRow));
  } catch {
    return internalError(res, 'Failed to fetch projects');
  }
}

async function handleCreate(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');

    const {
      title,
      slug,
      description,
      category,
      image,
      technologies,
      github,
      demo,
      highlights,
      content,
      publishDate,
      tags,
      readTime,
      status,
    } = req.body || {};

    if (!title || !description) {
      return badRequest(res, 'title and description are required');
    }

    const finalSlug = slug || generateSlug(title);

    const client = getAdminClient();
    const { data: existing } = await client
      .from('projects')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();
    if (existing) return badRequest(res, 'A project with this slug already exists');

    const { data: row, error } = await client
      .from('projects')
      .insert({
        id: randomUUID(),
        title,
        slug: finalSlug,
        description,
        category: category || 'General',
        image: image || DEFAULT_IMAGE,
        technologies: technologies || [],
        github: github || null,
        demo: demo || null,
        highlights: highlights || [],
        content: content || '',
        publish_date: publishDate || new Date().toISOString(),
        tags: tags || [],
        read_time: readTime || '5 min read',
        status: status || 'draft',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return badRequest(res, 'A project with this slug already exists');
      }
      return internalError(res, 'Failed to create project');
    }

    return sendJson(res, 201, {
      message: 'Project created successfully',
      project: projectFromRow(row),
    });
  } catch {
    return internalError(res, 'Failed to create project');
  }
}
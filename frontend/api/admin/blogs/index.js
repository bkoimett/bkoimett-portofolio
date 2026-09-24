// GET /api/admin/blogs + POST /api/admin/blogs – admin-only blog listing
// (includes drafts) and creation. Mirrors backend routes.
import { randomUUID } from 'node:crypto';
import { getAdminClient } from '../../_lib/supabase.js';
import { verifyAdminToken } from '../../_lib/auth.js';
import { generateSlug } from '../../_lib/slugs.js';
import { blogFromRow } from '../../_lib/serializers.js';
import { sendJson, badRequest, unauthorized, internalError, methodNotAllowed } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return handleList(req, res);
  if (req.method === 'POST') return handleCreate(req, res);
  return methodNotAllowed(res);
}

async function handleList(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');
    const { data, error } = await getAdminClient()
      .from('blogs')
      .select('*')
      .order('rank', { ascending: false })
      .order('publish_date', { ascending: false });
    if (error) return internalError(res, 'Failed to fetch blogs');
    return sendJson(res, 200, (data || []).map(blogFromRow));
  } catch {
    return internalError(res, 'Failed to fetch blogs');
  }
}

async function handleCreate(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');

    const { title, slug, description, content, image, tags, readTime, publishDate, status, rank } =
      req.body || {};

    if (!title || !description || !content) {
      return badRequest(res, 'title, description, and content are required');
    }

    const finalSlug = slug || generateSlug(title);

    const client = getAdminClient();
    const { data: existing } = await client
      .from('blogs')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();
    if (existing) return badRequest(res, 'A blog with this slug already exists');

    const { data: row, error } = await client
      .from('blogs')
      .insert({
        id: randomUUID(),
        title,
        slug: finalSlug,
        description,
        content,
        image: image || '',
        tags: tags || [],
        read_time: readTime || '5 min read',
        publish_date: publishDate || new Date().toISOString(),
        status: status || 'draft',
        rank: Number.isFinite(Number(rank)) ? Math.max(0, Math.trunc(Number(rank))) : 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return badRequest(res, 'A blog with this slug already exists');
      }
      return internalError(res, 'Failed to create blog');
    }

    return sendJson(res, 201, {
      message: 'Blog filed successfully',
      blog: blogFromRow(row),
    });
  } catch {
    return internalError(res, 'Failed to create blog');
  }
}
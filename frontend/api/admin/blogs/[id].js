// PUT /api/admin/blogs/:id + DELETE /api/admin/blogs/:id — admin only.
import { getAdminClient } from '../../_lib/supabase.js';
import { verifyAdminToken } from '../../_lib/auth.js';
import { generateSlug } from '../../_lib/slugs.js';
import { blogFromRow } from '../../_lib/serializers.js';
import { sendJson, badRequest, notFound, unauthorized, internalError, methodNotAllowed } from '../../_lib/http.js';

const FIELD_MAP = {
  title: 'title',
  slug: 'slug',
  description: 'description',
  content: 'content',
  image: 'image',
  tags: 'tags',
  readTime: 'read_time',
  publishDate: 'publish_date',
  status: 'status',
};

export default async function handler(req, res) {
  if (req.method === 'PUT') return handlePut(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return methodNotAllowed(res);
}

async function handlePut(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');
    const { id } = req.query;
    const body = req.body || {};
    const client = getAdminClient();

    const slug = body.slug || (body.title ? generateSlug(body.title) : undefined);
    if (slug) {
      const { data: existing } = await client
        .from('blogs')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .maybeSingle();
      if (existing) return badRequest(res, 'A blog with this slug already exists');
    }

    const patch = { updated_at: new Date().toISOString() };
    if (slug) patch.slug = slug;
    for (const [camel, column] of Object.entries(FIELD_MAP)) {
      if (camel !== 'slug' && body[camel] !== undefined) patch[column] = body[camel];
    }

    const { data: row, error } = await client
      .from('blogs')
      .update(patch)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return badRequest(res, 'A blog with this slug already exists');
      }
      return internalError(res, 'Failed to update blog');
    }
    if (!row) return notFound(res, 'Blog not found');

    return sendJson(res, 200, {
      message: 'Blog updated successfully',
      blog: blogFromRow(row),
    });
  } catch {
    return internalError(res, 'Failed to update blog');
  }
}

async function handleDelete(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');
    const { id } = req.query;
    const { data, error } = await getAdminClient()
      .from('blogs')
      .delete()
      .eq('id', id)
      .select();
    if (error) return internalError(res, 'Failed to delete blog');
    if (!data || data.length === 0) return notFound(res, 'Blog not found');
    return sendJson(res, 200, {
      message: 'Blog deleted successfully',
      blog: blogFromRow(data[0]),
    });
  } catch {
    return internalError(res, 'Failed to delete blog');
  }
}
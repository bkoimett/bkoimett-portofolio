// GET /api/blogs/slug/:slug – public single blog by slug (published only).
// Mirrors backend GET /api/blogs/slug/:slug. POST /api/blogs/slug/:slug with
// { id } is the public view-count increment (previously a separate view.js
// function; folded here to stay under the Vercel Hobby 12-function cap).
import { getAdminClient } from '../../_lib/supabase.js';
import { blogFromRow } from '../../_lib/serializers.js';
import { isValidId } from '../../_lib/slugs.js';
import { sendJson, badRequest, notFound, internalError, methodNotAllowed, PUBLIC_CACHE } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handleViewIncrement(req, res);
  return methodNotAllowed(res);
}

async function handleGet(req, res) {
  try {
    const { slug } = req.query;
    const { data, error } = await getAdminClient()
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) return internalError(res, 'Failed to fetch blog');
    if (!data) return notFound(res, 'Blog not found');

    return sendJson(res, 200, blogFromRow(data), PUBLIC_CACHE);
  } catch {
    return internalError(res, 'Failed to fetch blog');
  }
}

async function handleViewIncrement(req, res) {
  try {
    const id = req.body && req.body.id;
    if (!isValidId(id)) return badRequest(res, 'Invalid blog ID');
    const { data, error } = await getAdminClient().rpc('increment_blog_view', { p_id: id });
    if (error) return internalError(res, 'Failed to increment view count');
    if (data === null || data === undefined) return notFound(res, 'Blog not found');
    return sendJson(res, 200, { views: data });
  } catch {
    return internalError(res, 'Failed to increment view count');
  }
}
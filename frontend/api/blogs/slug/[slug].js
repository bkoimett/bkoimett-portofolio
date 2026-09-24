// GET /api/blogs/slug/:slug – public single blog by slug (published only).
// Mirrors backend GET /api/blogs/slug/:slug.
import { getAdminClient } from '../../_lib/supabase.js';
import { blogFromRow } from '../../_lib/serializers.js';
import { sendJson, notFound, internalError, methodNotAllowed, PUBLIC_CACHE } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);

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
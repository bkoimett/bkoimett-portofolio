// POST /api/blogs/:id/view – public view-count increment.
// Mirrors backend POST /api/blogs/:id/view via the increment_blog_view RPC.
import { getAdminClient } from '../../_lib/supabase.js';
import { isValidId } from '../../_lib/slugs.js';
import { sendJson, badRequest, notFound, internalError, methodNotAllowed } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  const { id } = req.query;
  if (!isValidId(id)) return badRequest(res, 'Invalid blog ID');

  try {
    const { data, error } = await getAdminClient().rpc('increment_blog_view', {
      p_id: id,
    });
    if (error) return internalError(res, 'Failed to increment view count');
    if (data === null || data === undefined) return notFound(res, 'Blog not found');
    return sendJson(res, 200, { views: data });
  } catch {
    return internalError(res, 'Failed to increment view count');
  }
}
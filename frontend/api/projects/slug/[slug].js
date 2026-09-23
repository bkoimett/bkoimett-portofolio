// GET /api/projects/slug/:slug — public single project by slug (published only).
// Mirrors backend GET /api/projects/slug/:slug.
import { getAdminClient } from '../../_lib/supabase.js';
import { projectFromRow } from '../../_lib/serializers.js';
import { sendJson, notFound, internalError, methodNotAllowed, PUBLIC_CACHE } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);

  try {
    const { slug } = req.query;
    const { data, error } = await getAdminClient()
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) return internalError(res, 'Failed to fetch project');
    if (!data) return notFound(res, 'Project not found');

    return sendJson(res, 200, projectFromRow(data), PUBLIC_CACHE);
  } catch {
    return internalError(res, 'Failed to fetch project');
  }
}
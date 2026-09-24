// GET /api/blogs – public blog listing (published only, ranked first).
// Mirrors backend GET /api/blogs. Admin blog CRUD lives in /api/admin/blogs.
import { getAdminClient } from '../_lib/supabase.js';
import { blogFromRow } from '../_lib/serializers.js';
import { sendJson, internalError, methodNotAllowed, PUBLIC_CACHE } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);

  try {
    const { data, error } = await getAdminClient()
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('rank', { ascending: false })
      .order('publish_date', { ascending: false });

    if (error) return internalError(res, 'Failed to fetch blogs');
    return sendJson(res, 200, (data || []).map(blogFromRow), PUBLIC_CACHE);
  } catch {
    return internalError(res, 'Failed to fetch blogs');
  }
}
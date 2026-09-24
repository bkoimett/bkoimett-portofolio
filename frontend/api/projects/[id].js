// GET /api/projects/:id + PUT /api/projects/:id + DELETE /api/projects/:id
// All admin-only, mirroring backend routes. UPDATE/PATCH/DELETE are dispatched
// here; the compact create/list live in projects/index.js. POST /api/projects/:id
// is the public view-count increment (previously a separate view.js function;
// folded here to stay under the Vercel Hobby 12-function cap).
import { getAdminClient } from '../_lib/supabase.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { generateSlug, isValidId } from '../_lib/slugs.js';
import { projectFromRow } from '../_lib/serializers.js';
import { sendJson, badRequest, notFound, unauthorized, internalError, methodNotAllowed } from '../_lib/http.js';

// camelCase body keys → snake_case columns. Unknown body fields are dropped,
// matching Mongoose ignoring schema-less keys on findByIdAndUpdate.
const FIELD_MAP = {
  title: 'title',
  slug: 'slug',
  description: 'description',
  category: 'category',
  image: 'image',
  technologies: 'technologies',
  github: 'github',
  demo: 'demo',
  highlights: 'highlights',
  content: 'content',
  publishDate: 'publish_date',
  tags: 'tags',
  readTime: 'read_time',
  status: 'status',
};

export default async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handleViewIncrement(req, res);
  if (req.method === 'PUT') return handlePut(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return methodNotAllowed(res);
}

async function handleViewIncrement(req, res) {
  try {
    const { id } = req.query;
    if (!isValidId(id)) return badRequest(res, 'Invalid project ID');
    const { data, error } = await getAdminClient().rpc('increment_project_view', { p_id: id });
    if (error) return internalError(res, 'Failed to increment view count');
    if (data === null || data === undefined) return notFound(res, 'Project not found');
    return sendJson(res, 200, { views: data });
  } catch {
    return internalError(res, 'Failed to increment view count');
  }
}

async function handleGet(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');
    const { id } = req.query;
    const { data, error } = await getAdminClient()
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return internalError(res, 'Failed to fetch project');
    if (!data) return notFound(res, 'Project not found');
    return sendJson(res, 200, projectFromRow(data));
  } catch {
    return internalError(res, 'Failed to fetch project');
  }
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
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .maybeSingle();
      if (existing) return badRequest(res, 'A project with this slug already exists');
    }

    const patch = { updated_at: new Date().toISOString() };
    if (slug) patch.slug = slug;
    for (const [camel, column] of Object.entries(FIELD_MAP)) {
      if (camel !== 'slug' && body[camel] !== undefined) patch[column] = body[camel];
    }

    const { data: row, error } = await client
      .from('projects')
      .update(patch)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return badRequest(res, 'A project with this slug already exists');
      }
      return internalError(res, 'Failed to update project');
    }
    if (!row) return notFound(res, 'Project not found');

    return sendJson(res, 200, {
      message: 'Project updated successfully',
      project: projectFromRow(row),
    });
  } catch {
    return internalError(res, 'Failed to update project');
  }
}

async function handleDelete(req, res) {
  try {
    if (!verifyAdminToken(req)) return unauthorized(res, 'Invalid token');
    const { id } = req.query;
    const { data, error } = await getAdminClient()
      .from('projects')
      .delete()
      .eq('id', id)
      .select();
    if (error) return internalError(res, 'Failed to delete project');
    if (!data || data.length === 0) return notFound(res, 'Project not found');
    return sendJson(res, 200, {
      message: 'Project deleted successfully',
      project: projectFromRow(data[0]),
    });
  } catch {
    return internalError(res, 'Failed to delete project');
  }
}
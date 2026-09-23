// Pure transform functions: MongoDB/Mongoose documents → Supabase rows.
// Kept dependency-free and side-effect-free so they can be unit-tested against
// fixtures without a database. The runner (run.js) applies them to real data.

function toId(value) {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return null;
}

function toIso(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function toStr(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function toStringArray(value) {
  return Array.isArray(value) ? value.map((v) => toStr(v)).filter(Boolean) : [];
}

function toSlug(value) {
  return toStr(value, '').trim().toLowerCase();
}

// maps a Mongo project document to a `projects` row
function mapProject(doc) {
  return {
    id: toId(doc._id),
    title: toStr(doc.title),
    slug: toSlug(doc.slug),
    description: toStr(doc.description),
    category: doc.category ? toStr(doc.category) : null,
    image: doc.image ? toStr(doc.image) : null,
    technologies: toStringArray(doc.technologies),
    github: doc.github ? toStr(doc.github) : null,
    demo: doc.demo ? toStr(doc.demo) : null,
    highlights: toStringArray(doc.highlights),
    content: toStr(doc.content),
    publish_date: toIso(doc.publishDate),
    tags: toStringArray(doc.tags),
    read_time: toStr(doc.readTime, '5 min read'),
    status: doc.status === 'draft' ? 'draft' : 'published',
    views: Number.isFinite(doc.views) ? doc.views : 0,
    created_at: toIso(doc.createdAt),
    updated_at: toIso(doc.updatedAt) || toIso(doc.createdAt),
  };
}

// maps a Mongo blog document to a `blogs` row
function mapBlog(doc) {
  return {
    id: toId(doc._id),
    title: toStr(doc.title),
    slug: toSlug(doc.slug),
    description: toStr(doc.description),
    content: toStr(doc.content),
    image: doc.image ? toStr(doc.image) : null,
    tags: toStringArray(doc.tags),
    read_time: toStr(doc.readTime, '5 min read'),
    publish_date: toIso(doc.publishDate),
    status: doc.status === 'draft' ? 'draft' : 'published',
    views: Number.isFinite(doc.views) ? doc.views : 0,
    created_at: toIso(doc.createdAt),
    updated_at: toIso(doc.updatedAt) || toIso(doc.createdAt),
  };
}

// maps a Mongo CV document to a `cvs` row.
// The GridFS binary is NOT copied here — it is migrated in Phase 4 (storage).
// `storage_path` is reserved at a deterministic path keyed by the source GridFS
// fileId so the Phase 4 file-copy step can populate the bytes without a second
// metadata pass.
function mapCv(doc) {
  const fileId = toId(doc.fileId);
  return {
    id: toId(doc._id),
    label: toStr(doc.label),
    file_name: toStr(doc.fileName),
    content_type: toStr(doc.contentType, 'application/pdf'),
    size: Number.isFinite(doc.size) ? doc.size : 0,
    storage_path: fileId ? `current/${fileId}.pdf` : 'current/unknown.pdf',
    active: Boolean(doc.active),
    created_at: toIso(doc.createdAt),
  };
}

// maps a Mongo admin document to an `admins` row. password_hash is copied as-is
// (already bcrypt). auth_user_id stays null until Phase 5 links Supabase Auth.
function mapAdmin(doc) {
  return {
    id: toId(doc._id),
    username: toStr(doc.username),
    password_hash: toStr(doc.passwordHash),
    auth_user_id: null,
    created_at: toIso(doc.createdAt),
  };
}

module.exports = { mapProject, mapBlog, mapCv, mapAdmin, toId, toIso };
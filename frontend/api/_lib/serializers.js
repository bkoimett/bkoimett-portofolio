// Row-to-API serializers: map snake_case Postgres rows back to the legacy
// Mongoose/camelCase JSON contract the frontend expects. Projects/blogs use
// `_id`; CVs use `id` (the legacy engine's toCV() shape) – do not cross them.
export function projectFromRow(row) {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    image: row.image,
    technologies: row.technologies,
    github: row.github,
    demo: row.demo,
    highlights: row.highlights,
    content: row.content,
    publishDate: row.publish_date,
    tags: row.tags,
    readTime: row.read_time,
    status: row.status,
    views: row.views,
    rank: row.rank ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function blogFromRow(row) {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    content: row.content,
    image: row.image,
    tags: row.tags,
    readTime: row.read_time,
    publishDate: row.publish_date,
    status: row.status,
    views: row.views,
    rank: row.rank ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// CV metadata shape only – the file bytes stay in GridFS until Phase 4.
export function cvFromRow(row) {
  return {
    id: row.id,
    label: row.label && row.label.length ? row.label : row.file_name,
    fileName: row.file_name,
    contentType: row.content_type,
    size: row.size,
    active: row.active,
    createdAt: row.created_at,
  };
}
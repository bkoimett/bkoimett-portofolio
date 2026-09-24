// Slug generation and id validation shared by the Vercel API functions.
// Both were validated by Mongoose/Mongo in the legacy backend; Postgres needs
// the same guards so malformed input stays a 4xx, never a 5xx.

export function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Accepts legacy Mongo ObjectIds (24 hex) and the UUID strings used for new
// Postgres rows – both are valid `text` primary keys.
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidId(id) {
  return typeof id === 'string' && (OBJECT_ID.test(id) || UUID.test(id));
}
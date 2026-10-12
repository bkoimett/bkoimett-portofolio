// Migration runner: MongoDB (Atlas) → Supabase PostgreSQL.
//
//   node migrations/run.js [--project --blog --cv --admin] [--dry-run]
//
// Reads documents from the existing MongoDB collections and UPSERTS them into
// Supabase, keyed on `id` (preserving the Mongo `_id`). Idempotent: safe to
// run more than once. NEVER deletes MongoDB data.
//
// Env required (backend/.env or process):
//   MONGODB_URI                – existing Atlas connection string
//   SUPABASE_URL               – https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  – service-role key (server-only)
//
// NOTE: GridFS binaries (image/CV bytes) are NOT copied here; that is Phase 4
// (storage). `cvs.storage_path` is reserved deterministically so the storage
// copy step can populate bytes without a second metadata pass. Image fields
// referencing /api/images/:id are reported so Phase 4 can rewrite them.

require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const { mapProject, mapBlog, mapCv, mapAdmin } = require('./transform');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');

const wanted = {
  project: args.has('--project') || args.size === 0,
  blog: args.has('--blog') || args.size === 0,
  cv: args.has('--cv') || args.size === 0,
  admin: args.has('--admin') || args.size === 0,
};

function missingEnv(name) {
  return !process.env[name];
}

function requireEnv(name) {
  if (missingEnv(name)) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(2);
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function upsertTable(supabase, table, rows, label) {
  if (!rows.length) {
    console.log(`${label}: 0 rows (nothing to migrate)`);
    return { label, count: 0 };
  }
  if (DRY_RUN) {
    console.log(`${label}: ${rows.length} rows (dry run, not written)`);
    return { label, count: rows.length };
  }

  let total = 0;
  for (const batch of chunk(rows, 200)) {
    const { error } = await supabase.from(table).upsert(batch, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });
    if (error) {
      console.error(`${label}: upsert batch failed: ${error.message}`);
      process.exitCode = 1;
      return { label, count: total };
    }
    total += batch.length;
  }
  console.log(`${label}: ${total} rows migrated`);
  return { label, count: total };
}

async function main() {
  ['MONGODB_URI', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].forEach(requireEnv);

  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log('Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });

  const db = mongoose.connection.db;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const summary = [];

  if (wanted.project) {
    const docs = await db.collection('projects').find({}).toArray();
    const rows = docs.map(mapProject).filter((r) => r.id && r.slug && r.title);
    summary.push(await upsertTable(supabase, 'projects', rows, 'projects'));
  }

  if (wanted.blog) {
    const docs = await db.collection('blogs').find({}).toArray();
    const rows = docs.map(mapBlog).filter((r) => r.id && r.slug && r.title);
    summary.push(await upsertTable(supabase, 'blogs', rows, 'blogs'));
  }

  if (wanted.cv) {
    const docs = await db.collection('cvs').find({}).toArray();
    const rows = docs.map(mapCv).filter((r) => r.id);
    summary.push(await upsertTable(supabase, 'cvs', rows, 'cvs'));
  }

  if (wanted.admin) {
    const docs = await db.collection('admins').find({}).toArray();
    const rows = docs.map(mapAdmin).filter((r) => r.id && r.username);
    summary.push(await upsertTable(supabase, 'admins', rows, 'admins'));
  }

  if (!DRY_RUN) {
    // Report image references that still point at the legacy /api/images/:id
    // contract so Phase 4 can rewrite them to Supabase Storage URLs.
    for (const table of ['projects', 'blogs']) {
      const { data, error } = await supabase
        .from(table)
        .select('id, image')
        .ilike('image', '/api/images/%');
      if (!error && data && data.length > 0) {
        console.log(
          `${table}: ${data.length} rows reference legacy /api/images/:id (rewrite in Phase 4)`
        );
      }
    }
  }

  console.log('MongoDB data left intact. Done.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
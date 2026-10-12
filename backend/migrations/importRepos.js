// Import curated GitHub repo records into the MongoDB `projects` collection.
//
//   node migrations/importRepos.js [path/to/records.json] [--dry-run] [--skip-existing]
//
// Each JSON record maps to the Project schema (camelCase): title, slug,
// description, category, image, technologies[], github, demo, highlights[],
// content, publishDate, tags[], readTime, status. Upsert is keyed on `slug` so
// the run is idempotent; existing view counts and timestamps are preserved.
// Pass --skip-existing to only create projects whose slug is not yet present;
// existing slugs are left untouched (the em-dash cleanup pass still runs).
//
// Also runs a cleanup pass that replaces em dashes (U+2014) with en dashes
// (U+2013) across existing project text fields, since the design system now
// forbids em dashes. This same cleaning is applied to imported records.
//
// Env required (backend/.env or process): MONGODB_URI

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Project = require('../models/Project');

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const SKIP_EXISTING = argv.includes('--skip-existing');
const recordsFile =
  argv.find((a) => !a.startsWith('--')) || path.join(__dirname, 'github-repos.json');

function clean(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\u2014/g, '\u2013').replace(/\s+/g, ' ').trim();
}

function cleanArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(clean).filter((v) => typeof v === 'string' && v.length);
}

function toProjectDoc(rec) {
  return {
    title: clean(rec.title) || 'Untitled',
    slug: clean(rec.slug),
    description: clean(rec.description) || clean(rec.title) || '',
    category: clean(rec.category) || 'General',
    image: clean(rec.image) || null,
    technologies: cleanArray(rec.technologies),
    github: clean(rec.github) || null,
    demo: clean(rec.demo) || null,
    highlights: cleanArray(rec.highlights),
    content: clean(rec.content) || '',
    publishDate: rec.publishDate ? new Date(rec.publishDate) : new Date(),
    tags: cleanArray(rec.tags),
    readTime: clean(rec.readTime) || '5 min read',
    status: rec.status === 'draft' ? 'draft' : 'published',
  };
}

function bulkCleanup() {
  return Project.find({}).lean().then((docs) => {
    const results = [];
    for (const doc of docs) {
      let dirty = false;
      for (const field of ['title', 'description', 'content', 'readTime', 'category']) {
        if (typeof doc[field] === 'string' && doc[field].includes('\u2014')) {
          doc[field] = clean(doc[field]);
          dirty = true;
        }
      }
      for (const field of ['technologies', 'tags', 'highlights']) {
        if (Array.isArray(doc[field]) && doc[field].some((v) => typeof v === 'string' && v.includes('\u2014'))) {
          doc[field] = cleanArray(doc[field]);
          dirty = true;
        }
      }
      if (dirty) results.push({ id: doc._id, doc });
    }
    return results;
  });
}

async function persistCleanup(touched) {
  for (const item of touched) {
    const { id, doc } = item;
    await Project.findOneAndUpdate({ _id: id }, { $set: { ...doc, updatedAt: new Date() } });
  }
  return touched;
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing required environment variable: MONGODB_URI');
    process.exit(2);
  }

  let records = [];
  try {
    records = JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
  } catch (err) {
    console.error(`Could not read records file ${recordsFile}: ${err.message}`);
    process.exit(2);
  }
  if (!Array.isArray(records)) {
    console.error('Records file must be a JSON array.');
    process.exit(2);
  }

  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Records loaded: ${records.length} (${recordsFile})`);
  console.log('Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });

  const existingSlugs = new Set((await Project.find({}, 'slug').lean()).map((d) => d.slug));
  let created = 0;
  let updated = 0;

  for (const rec of records) {
    const doc = toProjectDoc(rec);
    if (!doc.slug) {
      console.log(`SKIP (no slug): ${doc.title}`);
      continue;
    }

    if (SKIP_EXISTING && existingSlugs.has(doc.slug)) {
      console.log(`SKIP (already exists): ${doc.slug}`);
      continue;
    }

    if (DRY_RUN) {
      if (existingSlugs.has(doc.slug)) updated += 1;
      else created += 1;
      console.log(`[dry] ${existingSlugs.has(doc.slug) ? 'UPDATE' : 'CREATE'} ${doc.slug} (${doc.status})`);
      continue;
    }

    const existing = await Project.findOne({ slug: doc.slug }).lean();
    await Project.findOneAndUpdate(
      { slug: doc.slug },
      {
        $set: { ...doc, updatedAt: new Date() },
        $setOnInsert: { views: existing ? existing.views : 0, createdAt: existing ? existing.createdAt : new Date() },
      },
      { upsert: true, new: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    if (existing) updated += 1;
    else created += 1;
  }

  const touched = await bulkCleanup();
  if (!DRY_RUN) await persistCleanup(touched);
  console.log(`Cleanup: ${touched.length} existing project(s) contain em dashes${DRY_RUN ? ' (dry run, not saved)' : ' and were fixed'}.`);

  console.log(`Done. ${created} created, ${updated} updated${DRY_RUN ? ' (dry run, nothing written)' : ''}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
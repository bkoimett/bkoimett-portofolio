const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { Types } = require('mongoose');
const {
  mapProject,
  mapBlog,
  mapCv,
  mapAdmin,
  toIso,
} = require('../migrations/transform');

// Fixtures derive from the real Mongoose models and seed data (backend/seed.js).
const objectId = () => new Types.ObjectId();

describe('mapProject (Mongo → projects row)', () => {
  test('maps a full published project preserving _id and all fields', () => {
    const id = objectId();
    const createdAt = new Date('2025-06-15T00:00:00.000Z');
    const row = mapProject({
      _id: id,
      title: 'CareFacility Platform',
      slug: 'carefacility-platform',
      description: 'Full-stack healthcare management system.',
      category: 'Web Dev',
      image: 'https://images.unsplash.com/photo-1498050108023?w=600',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/bkoimett/carefacility',
      demo: 'https://theserenityplace.vercel.app',
      highlights: ['Real-time admin dashboard', 'Automated billing'],
      content: '## CareFacility Platform',
      publishDate: new Date('2025-06-15T00:00:00.000Z'),
      tags: ['healthcare', 'mern'],
      readTime: '7 min read',
      status: 'published',
      views: 12,
      createdAt,
      updatedAt: createdAt,
    });

    assert.equal(row.id, id.toString());
    assert.equal(row.slug, 'carefacility-platform');
    assert.equal(row.title, 'CareFacility Platform');
    assert.equal(row.category, 'Web Dev');
    assert.equal(row.image, 'https://images.unsplash.com/photo-1498050108023?w=600');
    assert.deepEqual(row.technologies, ['React', 'Node.js', 'MongoDB']);
    assert.deepEqual(row.highlights, ['Real-time admin dashboard', 'Automated billing']);
    assert.deepEqual(row.tags, ['healthcare', 'mern']);
    assert.equal(row.status, 'published');
    assert.equal(row.views, 12);
    assert.equal(row.read_time, '7 min read');
    assert.equal(row.publish_date, '2025-06-15T00:00:00.000Z');
    assert.equal(row.updated_at, createdAt.toISOString());
  });

  test('normalizes slug to lowercase and falls back to defaults', () => {
    const row = mapProject({
      _id: objectId(),
      title: 'LandLedger',
      slug: 'LandLedger — Title',
      description: 'Immutable title deed verification.',
    });
    assert.equal(row.slug, 'landledger — title');
    assert.equal(row.status, 'published');
    assert.equal(row.views, 0);
    assert.equal(row.read_time, '5 min read');
    assert.deepEqual(row.technologies, []);
    assert.deepEqual(row.highlights, []);
    // createdAt/updatedAt are Mongoose defaults; absent in raw fixture → null
    assert.equal(row.created_at, null);
    assert.equal(row.updated_at, null);
  });

  test('preserves draft status and null optional fields', () => {
    const row = mapProject({
      _id: objectId(),
      title: 'Draft secret project',
      slug: 'draft-secret-project',
      description: 'not yet public',
      status: 'draft',
      publishDate: null,
    });
    assert.equal(row.status, 'draft');
    assert.equal(row.publish_date, null);
    assert.equal(row.image, null);
    assert.equal(row.category, null);
  });

  test('handles invalid dates without crashing', () => {
    const row = mapProject({
      _id: objectId(),
      title: 'Broken date',
      slug: 'broken-date',
      description: 'x',
      publishDate: 'not-a-date',
      createdAt: null,
    });
    assert.equal(row.publish_date, null);
    assert.equal(row.created_at, null);
  });
});

describe('mapBlog (Mongo → blogs row)', () => {
  test('maps a full blog preserving required content', () => {
    const id = objectId();
    const publishDate = new Date('2026-09-21T00:00:00.000Z');
    const row = mapBlog({
      _id: id,
      title: 'Building a Portfolio Registry',
      slug: 'building-a-portfolio-registry',
      description: 'How I structured my public work.',
      content: '# Building a Portfolio Registry\nBody text.',
      image: 'https://images.unsplash.com/photo-1498050108023?w=600',
      tags: ['portfolio', 'registry'],
      readTime: '8 min read',
      publishDate,
      status: 'published',
      views: 142,
      createdAt: publishDate,
      updatedAt: publishDate,
    });

    assert.equal(row.id, id.toString());
    assert.equal(row.content, '# Building a Portfolio Registry\nBody text.');
    assert.equal(row.status, 'published');
    assert.equal(row.views, 142);
    assert.deepEqual(row.tags, ['portfolio', 'registry']);
  });
});

describe('mapCv (Mongo → cvs row, metadata only)', () => {
  test('reserves deterministic storage_path from GridFS fileId', () => {
    const fileId = objectId();
    const row = mapCv({
      _id: objectId(),
      label: '2026 Full-Stack CV',
      fileName: 'bkoimett-cv-2026.pdf',
      contentType: 'application/pdf',
      size: 4096,
      fileId,
      active: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    assert.equal(row.storage_path, `current/${fileId.toString()}.pdf`);
    assert.equal(row.content_type, 'application/pdf');
    assert.equal(row.size, 4096);
    assert.equal(row.active, true);
    assert.equal(row.file_name, 'bkoimett-cv-2026.pdf');
  });

  test('defaults content type and handles missing fileId', () => {
    const row = mapCv({ _id: objectId(), fileName: 'cv.pdf', active: false });
    assert.equal(row.content_type, 'application/pdf');
    assert.equal(row.size, 0);
    assert.equal(row.storage_path, 'current/unknown.pdf');
    assert.equal(row.active, false);
  });
});

describe('mapAdmin (Mongo → admins row)', () => {
  test('preserves bcrypt hash and username, leaves auth_user_id null', () => {
    const hash = '$2a$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ1234';
    const row = mapAdmin({
      _id: objectId(),
      username: 'testadmin',
      passwordHash: hash,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    assert.equal(row.username, 'testadmin');
    assert.equal(row.password_hash, hash);
    assert.equal(row.auth_user_id, null);
  });
});

describe('toIso helper', () => {
  test('returns ISO string for Date, null for invalid', () => {
    assert.equal(toIso(new Date('2020-01-01T00:00:00.000Z')), '2020-01-01T00:00:00.000Z');
    assert.equal(toIso(null), null);
    assert.equal(toIso('garbage'), null);
    assert.equal(toIso(undefined), null);
  });
});
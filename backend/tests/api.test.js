const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PassThrough } = require('stream');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

const Admin = require('../models/Admin');
const Project = require('../models/Project');
const CV = require('../models/CV');
const gridfs = require('../gridfs');
const realGetBucket = gridfs.getBucket;

const mockAdmin = {
  _id: 'admin123',
  username: 'testadmin',
  passwordHash: bcrypt.hashSync('testpass123', 10),
  verifyPassword: async function (pw) { return bcrypt.compare(pw, this.passwordHash); },
  save: async function () { return this; }
};

function mockFn() {
  const fn = function (...args) {
    fn.calls.push(args);
    return fn._impl(...args);
  };
  fn.calls = [];
  fn._impl = async function () { return undefined; };
  fn.mockClear = function () { fn.calls = []; };
  fn.mockReset = function () { fn.calls = []; fn._impl = async function () { return undefined; }; };
  fn.mockResolvedValue = function (value) { fn._impl = async function () { return value; }; };
  fn.mockImplementation = function (impl) { fn._impl = impl; };
  return fn;
}

Admin.findOne = mockFn();
Admin.findById = mockFn();
Admin.findOne.mockResolvedValue(mockAdmin);

Project.find = mockFn();
Project.findOne = mockFn();
Project.findById = mockFn();
Project.findByIdAndUpdate = mockFn();
Project.findByIdAndDelete = mockFn();

CV.findOne = mockFn();
CV.find = mockFn();
CV.findById = mockFn();
CV.updateMany = mockFn();
CV.create = mockFn();
CV.countDocuments = mockFn();
CV.findByIdAndDelete = mockFn();

const mockCvRecord = {
  _id: 'cv123',
  label: '2026 Full-Stack CV',
  fileName: 'bkoimett-cv-2026.pdf',
  contentType: 'application/pdf',
  size: 4096,
  active: true,
  createdAt: new Date(),
};

function fakePdfBucket() {
  return {
    openUploadStream() {
      const stream = new PassThrough();
      stream.id = new mongoose.Types.ObjectId();
      stream.length = 0;
      return stream;
    },
    openDownloadStream() {
      const stream = new PassThrough();
      stream.push(Buffer.from('%PDF-1.4 test bytes'));
      stream.end();
      return stream;
    },
    delete: async () => undefined,
  };
}

const app = require('../index');

beforeEach(() => {
  Admin.findOne.mockReset();
  Admin.findById.mockReset();
  Project.find.mockReset();
  Project.findOne.mockReset();
  Project.findById.mockReset();
  Project.findByIdAndUpdate.mockReset();
  Project.findByIdAndDelete.mockReset();
  CV.findOne.mockReset();
  CV.find.mockReset();
  CV.findById.mockReset();
  CV.updateMany.mockReset();
  CV.create.mockReset();
  CV.countDocuments.mockReset();
  CV.findByIdAndDelete.mockReset();
  gridfs.getBucket = realGetBucket;
});

describe('Admin Auth', () => {
  test('POST /api/admin/login rejects missing credentials', async () => {
    const res = await request(app).post('/api/admin/login').send({});
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid credentials');
  });

  test('POST /api/admin/login rejects invalid username', async () => {
    Admin.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/admin/login').send({ username: 'nobody', password: 'whatever' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid credentials');
  });

  test('POST /api/admin/login accepts valid credentials', async () => {
    Admin.findOne.mockResolvedValue(mockAdmin);
    const res = await request(app).post('/api/admin/login').send({ username: 'testadmin', password: 'testpass123' });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  test('POST /api/admin/login rejects wrong password', async () => {
    Admin.findOne.mockResolvedValue(mockAdmin);
    const res = await request(app).post('/api/admin/login').send({ username: 'testadmin', password: 'wrongpass' });
    assert.equal(res.status, 401);
  });
});

describe('Projects API', () => {
  test('GET /api/projects with no auth returns published only', async () => {
    Project.find.mockResolvedValue([{ title: 'Published Project', status: 'published' }]);
    const res = await request(app).get('/api/projects');
    assert.equal(res.status, 200);
    assert.equal(Project.find.calls[0][0].status, 'published');
  });

  test('GET /api/projects with malformed token falls back to public', async () => {
    Project.find.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', 'Bearer malformed-token');
    assert.equal(res.status, 200);
  });

  test('GET /api/projects/:id without auth returns 401', async () => {
    const res = await request(app).get('/api/projects/someid');
    assert.equal(res.status, 401);
  });

  test('GET /api/projects/:id with auth returns project', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    Project.findById.mockResolvedValue({ title: 'Test', _id: '123' });
    const res = await request(app)
      .get('/api/projects/123')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
  });

  test('POST /api/projects without auth returns 401', async () => {
    const res = await request(app).post('/api/projects').send({ title: 'X', description: 'Y' });
    assert.equal(res.status, 401);
  });
});

describe('Project View Tracking', () => {
    test('POST /api/projects/:id/view with invalid ObjectId returns 400', async () => {
      const res = await request(app).post('/api/projects/invalid-id/view');
      assert.equal(res.status, 400);
    });
  });

describe('CV API', () => {
  test('GET /api/cv returns 404 when no active CV is filed', async () => {
    CV.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/cv');
    assert.equal(res.status, 404);
  });

  test('GET /api/cv returns the active CV metadata', async () => {
    CV.findOne.mockResolvedValue(mockCvRecord);
    const res = await request(app).get('/api/cv');
    assert.equal(res.status, 200);
    assert.equal(res.body.active, true);
    assert.equal(res.body.fileName, 'bkoimett-cv-2026.pdf');
  });

  test('GET /api/cv/download streams the active CV file', async () => {
    CV.findOne.mockResolvedValue({ ...mockCvRecord, fileId: new mongoose.Types.ObjectId() });
    gridfs.getBucket = fakePdfBucket;
    const res = await request(app).get('/api/cv/download');
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-type'], 'application/pdf');
    assert.ok(res.body.toString().startsWith('%PDF'));
  });

  test('POST /api/admin/cvs without auth returns 401', async () => {
    const res = await request(app).post('/api/admin/cvs');
    assert.equal(res.status, 401);
  });

  test('POST /api/admin/cvs files a CV and activates the first one', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    CV.countDocuments.mockResolvedValue(0);
    CV.create.mockImplementation(async (data) => ({ _id: 'cv_new', ...data, save: async () => null }));

    gridfs.getBucket = fakePdfBucket;
    const res = await request(app)
      .post('/api/admin/cvs')
      .set('Authorization', `Bearer ${token}`)
      .attach('cv', Buffer.from('%PDF-1.4 new cv'), {
        filename: 'coordinator-cv.pdf',
        contentType: 'application/pdf',
      })
      .field('label', 'Coordinator CV');

    assert.equal(res.status, 201);
    assert.equal(CV.create.calls[0][0].active, true);
    assert.equal(CV.create.calls[0][0].fileName, 'coordinator-cv.pdf');
  });

  test('POST /api/admin/cvs rejects non-PDF uploads', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    const res = await request(app)
      .post('/api/admin/cvs')
      .set('Authorization', `Bearer ${token}`)
      .attach('cv', Buffer.from('# not a pdf'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });
    assert.equal(res.status, 400);
    assert.ok(/PDF/i.test(res.body.error));
  });

  test('PUT /api/admin/cvs/:id/active sets one CV as downloadable', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    const cvId = new mongoose.Types.ObjectId().toString();
    const target = { ...mockCvRecord, _id: cvId, active: false, save: async function () { this.active = true; } };
    CV.findById.mockResolvedValue(target);
    const res = await request(app)
      .put(`/api/admin/cvs/${cvId}/active`)
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(CV.updateMany.calls[0][0]._id.$ne, cvId);
    assert.equal(res.body.cv.active, true);
  });

  test('DELETE /api/admin/cvs/:id removes the record and grid file', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    const cvId = new mongoose.Types.ObjectId().toString();
    const deleted = { ...mockCvRecord, fileId: new mongoose.Types.ObjectId() };
    CV.findByIdAndDelete.mockResolvedValue(deleted);
    let deletedFile = null;
    const bucket = fakePdfBucket();
    bucket.delete = async (fileId) => { deletedFile = fileId; };
    gridfs.getBucket = () => bucket;

    const res = await request(app)
      .delete(`/api/admin/cvs/${cvId}`)
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(deletedFile);
    assert.equal(deletedFile.toString(), deleted.fileId.toString());
  });

  test('DELETE /api/admin/cvs/:id invalid id returns 400', async () => {
    const token = jwt.sign({ id: 'admin123', username: 'testadmin' }, process.env.JWT_SECRET);
    const res = await request(app)
      .delete('/api/admin/cvs/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 400);
  });
});
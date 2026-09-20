const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

const Admin = require('../models/Admin');
const Project = require('../models/Project');

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

const app = require('../index');

beforeEach(() => {
  Admin.findOne.mockReset();
  Admin.findById.mockReset();
  Project.find.mockReset();
  Project.findOne.mockReset();
  Project.findById.mockReset();
  Project.findByIdAndUpdate.mockReset();
  Project.findByIdAndDelete.mockReset();
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
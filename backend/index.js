const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
require('dotenv').config();

const Project = require('./models/Project');
const Admin = require('./models/Admin');
const CV = require('./models/CV');
const Blog = require('./models/Blog');
const authMiddleware = require('./middleware/auth');
const gridfs = require('./gridfs');

const app = express();
const PORT = process.env.PORT || 3001;

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const SITE_URL = (process.env.SITE_URL || 'https://bkoimett-portofolio.vercel.app').replace(/\/+$/, '');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toISODate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

function isValidSlug(slug) {
  if (typeof slug !== 'string') return false;
  const s = slug.trim();
  if (!s || s.length < 2 || s.length > 120) return false;
  if (s.includes('..') || s.includes('//') || s.includes(' ')) return false;
  if (/^admin/i.test(s)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(s);
}

function buildSitemapXml({ projects, blogs }) {
  const urls = [];

  // Static routes
  urls.push({ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' });
  urls.push({ loc: `${SITE_URL}/projects`, changefreq: 'weekly', priority: '0.9' });
  urls.push({ loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.9' });
  urls.push({ loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.7' });

  const seen = new Set();

  for (const p of projects) {
    if (!p || !isValidSlug(p.slug)) continue;
    const key = `p:${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const lastmod = toISODate(p.updatedAt || p.publishDate || p.createdAt);
    urls.push({
      loc: `${SITE_URL}/projects/${p.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  for (const b of blogs) {
    if (!b || !isValidSlug(b.slug)) continue;
    const key = `b:${b.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const lastmod = toISODate(b.updatedAt || b.publishDate || b.createdAt);
    urls.push({
      loc: `${SITE_URL}/blog/${b.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const body = urls
    .map((u) => {
      const lastmodTag = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
      return `  <url><loc>${escapeXml(u.loc)}</loc>${lastmodTag}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

async function handleSitemap(req, res) {
  try {
    let projects = [];
    let blogs = [];
    try {
      projects = await Project.find({ status: 'published' }).select('slug updatedAt publishDate createdAt').lean();
    } catch (e) {
      console.error('Sitemap projects query failed:', e.message);
    }
    try {
      blogs = await Blog.find({ status: 'published' }).select('slug updatedAt publishDate createdAt').lean();
    } catch (e) {
      console.error('Sitemap blogs query failed:', e.message);
    }
    const xml = buildSitemapXml({ projects, blogs });
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error.message);
    // Graceful fallback: static routes only, still valid XML, 200 not 500 to avoid breaking crawlers
    const xml = buildSitemapXml({ projects: [], blogs: [] });
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.send(xml);
  }
}

function toCV(cv) {
  return {
    id: cv._id,
    label: cv.label && cv.label.length ? cv.label : cv.fileName,
    fileName: cv.fileName,
    contentType: cv.contentType,
    size: cv.size,
    active: cv.active,
    createdAt: cv.createdAt,
  };
}

const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname);
    if (isPdf) cb(null, true);
    else cb(new Error('Only PDF files are accepted'));
  },
});

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype) || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.originalname);
    if (ok) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, webp, gif, svg) are accepted'));
  },
});

function startServer() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.startsWith('mongodb')) {
    throw new Error('MONGODB_URI must be set to a valid mongodb:// or mongodb+srv:// connection string');
  }

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST - Admin login.
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatches = await admin.verifyPassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// PUT - Update admin settings (admin only).
app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    const trimmedUsername = typeof newUsername === 'string' ? newUsername.trim() : '';

    if (!trimmedUsername && !newPassword) {
      return res.status(400).json({ error: 'No settings provided' });
    }

    if (trimmedUsername && trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (trimmedUsername && trimmedUsername !== admin.username) {
      const existing = await Admin.findOne({ username: trimmedUsername });
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      admin.username = trimmedUsername;
    }

    if (newPassword) {
      admin.passwordHash = await require('bcryptjs').hash(newPassword, 10);
    }

    await admin.save();

    res.json({
      message: 'Settings updated successfully',
      username: admin.username
    });
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get all published projects for public pages, or all projects for authenticated admins.
app.get('/api/projects', async (req, res) => {
  try {
    let isAdmin = false;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        isAdmin = true;
      } catch {
        // Invalid token – treat as public visitor
      }
    }
    const filter = isAdmin ? {} : { status: 'published' };
    const projects = await Project.find(filter);
    res.json(projects);
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET - Single project by SLUG for public blog/project detail pages.
app.get('/api/projects/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// GET - Single project by ID for admin dashboard editing.
app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST - Increment project view count (public endpoint).
app.post('/api/projects/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format – return 400 not 500 for malformed ids
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ views: project.views });
  } catch (error) {
    console.error('View increment error:', error.message);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
});

// Contact form endpoint.
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // TODO: Send email with nodemailer (Phase 2)
    // For now, acknowledge receipt without logging PII
    res.json({ success: true, message: 'Message received!' });
  } catch {
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

// GET - Active CV metadata (public).
app.get('/api/cv', async (req, res) => {
  try {
    const cv = await CV.findOne({ active: true }, null, { sort: { createdAt: -1 } });
    if (!cv) {
      return res.status(404).json({ error: 'No curriculum vitae on file' });
    }
    res.json(toCV(cv));
  } catch {
    res.status(500).json({ error: 'Failed to fetch CV' });
  }
});

// GET - Download the active CV (public).
app.get('/api/cv/download', async (req, res) => {
  try {
    const cv = await CV.findOne({ active: true }, null, { sort: { createdAt: -1 } });
    if (!cv) {
      return res.status(404).json({ error: 'No curriculum vitae on file' });
    }
    if (!mongoose.Types.ObjectId.isValid(cv.fileId)) {
      return res.status(404).json({ error: 'CV file missing from storage' });
    }

    let bucket;
    try {
      bucket = gridfs.getBucket();
    } catch {
      return res.status(503).json({ error: 'CV storage unavailable' });
    }

    const downloadStream = bucket.openDownloadStream(cv.fileId);
    res.setHeader('Content-Type', cv.contentType || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="bkoimett-cv.pdf"'
    );
    downloadStream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ error: 'CV file missing from storage' });
      } else {
        res.end();
      }
    });
    downloadStream.pipe(res);
  } catch {
    res.status(500).json({ error: 'Failed to serve CV' });
  }
});

// GET - All CV records (admin only).
app.get('/api/admin/cvs', authMiddleware, async (req, res) => {
  try {
    const cvs = await CV.find().sort({ createdAt: -1 });
    res.json(cvs.map(toCV));
  } catch {
    res.status(500).json({ error: 'Failed to fetch CV records' });
  }
});

// POST - File a new CV (admin only, pdf upload).
app.post('/api/admin/cvs', authMiddleware, (req, res) => {
  cvUpload.single('cv')(req, res, async (uploadError) => {
    if (uploadError) {
      const message =
        uploadError.code === 'LIMIT_FILE_SIZE'
          ? 'File is too large (max 10MB)'
          : uploadError.message || 'Upload failed';
      return res.status(400).json({ error: message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Choose a PDF file to file' });
      }

      const label = typeof req.body.label === 'string' ? req.body.label.trim() : '';
      const existingCount = await CV.countDocuments({});
      const makeActive = req.body.active === 'true' || existingCount === 0;

      let bucket;
      try {
        bucket = gridfs.getBucket();
      } catch {
        return res.status(503).json({ error: 'CV storage unavailable' });
      }

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype || 'application/pdf',
        metadata: { label, active: makeActive },
      });
      uploadStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.once('finish', resolve);
        uploadStream.once('error', reject);
      });

      const cv = await CV.create({
        label,
        fileName: req.file.originalname,
        contentType: req.file.mimetype || 'application/pdf',
        size: req.file.size,
        fileId: uploadStream.id,
        active: makeActive,
      });

      if (makeActive) {
        await CV.updateMany({ _id: { $ne: cv._id } }, { $set: { active: false } });
      }

      res.status(201).json({
        message: makeActive
          ? 'CV filed and set as the downloadable record'
          : 'CV filed to the records',
        cv: toCV(cv),
      });
    } catch (error) {
      console.error('CV upload error:', error.message);
      res.status(500).json({ error: 'Failed to file CV' });
    }
  });
});

// PUT - Set which CV is downloadable (admin only).
app.put('/api/admin/cvs/:id/active', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid CV id' });
    }

    const cv = await CV.findById(id);
    if (!cv) {
      return res.status(404).json({ error: 'CV record not found' });
    }

    await CV.updateMany({ _id: { $ne: id } }, { $set: { active: false } });
    cv.active = true;
    await cv.save();

    res.json({ message: 'CV is now the downloadable record', cv: toCV(cv) });
  } catch {
    res.status(500).json({ error: 'Failed to update CV status' });
  }
});

// DELETE - Remove a CV record and its file (admin only).
app.delete('/api/admin/cvs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid CV id' });
    }

    const cv = await CV.findByIdAndDelete(id);
    if (!cv) {
      return res.status(404).json({ error: 'CV record not found' });
    }

    try {
      await gridfs.getBucket().delete(cv.fileId);
    } catch {
      // Grid file already removed – nothing left to clean up
    }

    res.json({ message: 'CV record deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete CV record' });
  }
});

// POST - Upload title image (admin only, jpeg/png/webp/gif/svg ≤5MB → GridFS images)
app.post('/api/admin/images', authMiddleware, (req, res) => {
  imageUpload.single('image')(req, res, async (uploadError) => {
    if (uploadError) {
      const message = uploadError.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5MB)' : uploadError.message || 'Upload failed';
      return res.status(400).json({ error: message });
    }
    try {
      if (!req.file) return res.status(400).json({ error: 'Choose an image file to upload' });
      let bucket;
      try { bucket = gridfs.getImageBucket(); } catch { return res.status(503).json({ error: 'Image storage unavailable' }); }
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { uploadedBy: req.user?.id || 'admin', originalName: req.file.originalname },
      });
      uploadStream.end(req.file.buffer);
      await new Promise((resolve, reject) => { uploadStream.once('finish', resolve); uploadStream.once('error', reject); });
      const url = `/api/images/${uploadStream.id}`;
      res.status(201).json({ url, fileId: uploadStream.id.toString(), contentType: req.file.mimetype, size: req.file.size });
    } catch (error) {
      console.error('Image upload error:', error.message);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });
});

// GET - Serve image by id (public, cached)
app.get('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'Image not found' });
    let bucket;
    try { bucket = gridfs.getImageBucket(); } catch { return res.status(503).json({ error: 'Image storage unavailable' }); }
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
    if (!files.length) return res.status(404).json({ error: 'Image not found' });
    const file = files[0];
    res.setHeader('Content-Type', file.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));
    downloadStream.on('error', () => { if (!res.headersSent) res.status(404).json({ error: 'Image not found' }); else res.end(); });
    downloadStream.pipe(res);
  } catch {
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// POST - Create new project (admin only).
app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { 
      title, 
      slug, 
      description, 
      category, 
      image, 
      technologies, 
      github, 
      demo, 
      highlights, 
      content, 
      publishDate, 
      tags, 
      readTime, 
      status 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        error: 'title and description are required' 
      });
    }

    const finalSlug = slug || generateSlug(title);

    const existingProject = await Project.findOne({ slug: finalSlug });
    if (existingProject) {
      return res.status(400).json({ 
        error: 'A project with this slug already exists' 
      });
    }

    const newProject = new Project({
      title,
      slug: finalSlug,
      description,
      category: category || 'General',
      image: image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format',
      technologies: technologies || [],
      github,
      demo,
      highlights: highlights || [],
      content: content || '',
      publishDate: publishDate || new Date(),
      tags: tags || [],
      readTime: readTime || '5 min read',
      status: status || 'draft'
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: 'Project created successfully',
      project: savedProject
    });
  } catch {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT - Update project (admin only).
app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }

    if (updateData.slug) {
      const existingProject = await Project.findOne({ 
        slug: updateData.slug,
        _id: { $ne: id }
      });
      if (existingProject) {
        return res.status(400).json({ 
          error: 'A project with this slug already exists' 
        });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE - Delete project (admin only).
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ 
      message: 'Project deleted successfully',
      project: deletedProject 
    });
  } catch {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// GET - All published blogs for public blog page.
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ publishDate: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET - Single blog by slug for public detail page.
app.get('/api/blogs/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(blog);
  } catch {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// POST - Increment blog view count (public endpoint).
app.post('/api/blogs/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ views: blog.views });
  } catch (error) {
    console.error('View increment error:', error.message);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
});

// GET - All blogs (admin only, includes drafts).
app.get('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishDate: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// POST - Create new blog (admin only).
app.post('/api/admin/blogs', authMiddleware, async (req, res) => {
  try {
    const { title, slug, description, content, image, tags, readTime, publishDate, status } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: 'title, description, and content are required' });
    }

    const finalSlug = slug || generateSlug(title);

    const existingBlog = await Blog.findOne({ slug: finalSlug });
    if (existingBlog) {
      return res.status(400).json({ error: 'A blog with this slug already exists' });
    }

    const newBlog = new Blog({
      title,
      slug: finalSlug,
      description,
      content,
      image: image || '',
      tags: tags || [],
      readTime: readTime || '5 min read',
      publishDate: publishDate || new Date(),
      status: status || 'draft',
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({
      message: 'Blog filed successfully',
      blog: savedBlog,
    });
  } catch {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// PUT - Update blog (admin only).
app.put('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }

    if (updateData.slug) {
      const existingBlog = await Blog.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingBlog) {
        return res.status(400).json({ error: 'A blog with this slug already exists' });
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });
  } catch {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE - Delete blog (admin only).
app.delete('/api/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      message: 'Blog deleted successfully',
      blog: deletedBlog,
    });
  } catch {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Dynamic sitemap – public, excludes drafts/admin, uses DB lastmod when available
app.get('/sitemap.xml', handleSitemap);
app.get('/api/sitemap.xml', handleSitemap);

if (require.main === module) {
  startServer();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.startServer = startServer;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Project = require('./models/Project');
const Admin = require('./models/Admin');
const authMiddleware = require('./middleware/auth');

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
        // Invalid token — treat as public visitor
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

if (require.main === module) {
  startServer();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.startServer = startServer;

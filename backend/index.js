const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Project = require('./models/Project');
const {
  getUsername,
  setUsername,
  setPassword,
  verifyPassword
} = require('./config/admin');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Generate slug from title if not provided.
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

app.use(cors());
app.use(express.json());

// POST - Admin login.
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !username ||
      !password ||
      username !== getUsername() ||
      !(await verifyPassword(password))
    ) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    if (trimmedUsername) {
      setUsername(trimmedUsername);
    }

    if (newPassword) {
      await setPassword(newPassword);
    }

    res.json({
      message: 'Settings updated successfully',
      username: getUsername()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all published projects for public pages, or all projects for authenticated admins.
app.get('/api/projects', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const isAdmin = token && jwt.verify(token, process.env.JWT_SECRET);
    const filter = isAdmin ? {} : { status: 'published' };
    const projects = await Project.find(filter);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Single project by ID for admin dashboard editing.
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint.
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Message received!' });
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
      image: image || 'https://via.placeholder.com/400',
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
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
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

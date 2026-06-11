const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const Project = require('./models/Project');

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'published' });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Single project by SLUG (for blog posts)
app.get('/api/projects/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, slug, description, category, image, technologies, github, demo, highlights, content, publishDate, tags, readTime, status } = req.body;
    
    // Validate required fields
    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' });
    }
    
    const newProject = new Project({
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
      status: status || 'published'
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = new Date();
    
    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Here you would typically send an email or save to database
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Message received!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
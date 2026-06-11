const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: String,
  image: String,
  technologies: [String],
  github: String,
  demo: String,
  highlights: [String],
  // Blog fields (will be used in Phase 3)
  content: String,
  publishDate: Date,
  tags: [String],
  readTime: String,
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
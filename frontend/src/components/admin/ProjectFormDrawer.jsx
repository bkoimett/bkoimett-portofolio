import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ProjectFormDrawer = ({
  isOpen,
  onClose,
  onSave,
  projectId,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General',
    technologies: [],
    tags: [],
    readTime: '5 min read',
    status: 'draft',
    content: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing project data
  useEffect(() => {
    if (projectId && initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'General',
        technologies: initialData.technologies || [],
        tags: initialData.tags || [],
        readTime: initialData.readTime || '5 min read',
        status: initialData.status || 'draft',
        content: initialData.content || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'General',
        technologies: [],
        tags: [],
        readTime: '5 min read',
        status: 'draft',
        content: ''
      });
    }
  }, [projectId, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (e, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (projectId) {
        await api.put(`/api/projects/${projectId}`, formData);
        setSuccess('Project updated successfully');
      } else {
        await api.post('/api/projects', formData);
        setSuccess('Project created successfully');
      }
      onSave(formData);
      onClose();
      setFormData({
        title: '',
        slug: '',
        category: 'General',
        technologies: [],
        tags: [],
        readTime: '5 min read',
        status: 'draft',
        content: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle outside click (backdrop close)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.className && e.target.className.contains('project-form-drawer')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-xl bg-black/40"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fixed top-0 right-0 left-0 z-50 max-w-md mx-auto bg-surface-container-low rounded-lg p-6 shadow-lg transform opacity-0 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <h2 id="drawer-title" className="text-headline-lg text-headline-lg text-on-surface mb-4">
          {projectId ? 'Edit Project' : 'Create New Project'}
        </h2>

        {error && (
          <div className="bg-error-container/20 border border-error/30 rounded-lg p-3 mb-4 animate-pulse">
            <span className="material-symbols-outlined text-error text-[20px]">error</span>
            <span className="font-label-md text-label-md text-error">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-primary-container/20 border border-primary/30 rounded-lg p-3 mb-4 animate-pulse">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <span className="font-label-md text-label-md text-primary">{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="project-slug"
              />
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="General"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Technologies (comma-separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies.join(', ')}
              onChange={(e) => handleArrayInput(e, 'technologies')}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInput(e, 'tags')}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="javascript, web, tutorial"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Read Time</label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="5 min read"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Status</label>
            <select
              value={formData.status}
              onChange={handleInputChange}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Content (Markdown)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="6"
              placeholder="# Project Title\n\nYour markdown content here..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            ></textarea>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-on-primary rounded-lg py-2 font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-highest text-on-surface rounded-lg py-2 font-label-md text-label-md hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormDrawer;
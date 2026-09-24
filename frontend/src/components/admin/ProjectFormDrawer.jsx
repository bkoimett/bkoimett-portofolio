import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';

const emptyForm = {
  title: '',
  slug: '',
  category: 'General',
  technologies: [],
  tags: [],
  readTime: '5 min read',
  status: 'draft',
  content: '',
  image: '',
};

const ProjectFormDrawer = ({ isOpen, onClose, projectId, initialData, onSaved }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (projectId && initialData) {
      setFormData({
        ...emptyForm,
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'General',
        technologies: initialData.technologies || [],
        tags: initialData.tags || [],
        readTime: initialData.readTime || '5 min read',
        status: initialData.status || 'draft',
        content: initialData.content || '',
        image: initialData.image || '',
      });
    } else {
      setFormData(emptyForm);
    }
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [isOpen, projectId, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()).filter(Boolean),
    }));
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/admin/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (projectId) {
        await api.put(`/projects/${projectId}`, formData);
        onSaved('Record amended');
      } else {
        await api.post('/projects', formData);
        onSaved('Record filed');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save the record');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const fieldClass =
    'input-base';

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto border-l border-rule bg-paper shadow-[0_0_40px_rgba(0,0,0,0.18)]"
      >
        <header className="border-b border-rule px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="file-index-sm">
                {projectId ? `AMEND · BK-${projectId.slice(-4)}` : 'FILE · NEW'}
              </p>
              <h2
                id="drawer-title"
                className="mt-0.5 text-title font-semibold text-ink"
              >
                {projectId ? 'Amend record' : 'File new record'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close form"
              className="inline-flex h-9 w-9 items-center justify-center border border-rule-strong font-mono text-sm text-ink hover:border-registry hover:text-registry"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="px-6 py-5">
          {error && (
            <p className="mb-4 border border-stamp px-4 py-2.5 font-mono text-[13px] text-stamp">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-title">
                  Title
                </label>
                <input
                  ref={titleRef}
                  id="f-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                  placeholder="Record title"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-slug">
                  Slug
                </label>
                <input
                  id="f-slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="record-slug"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-category">
                  Division
                </label>
                <input
                  id="f-category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="Web Dev, Blockchain, PWA…"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-tech">
                  Technologies (comma-separated)
                </label>
                <input
                  id="f-tech"
                  type="text"
                  name="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'technologies')}
                  className={fieldClass}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-tags">
                  Tags (comma-separated)
                </label>
                <input
                  id="f-tags"
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'tags')}
                  className={fieldClass}
                  placeholder="web, api, deployment"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-readtime">
                  Read time
                </label>
                <input
                  id="f-readtime"
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="5 min read"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-status">
                  Status
                </label>
                <select
                  id="f-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-image">
                  Title image
                </label>
                <div className="flex gap-2">
                  <input
                    id="f-image"
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={`${fieldClass} flex-1`}
                    placeholder="https://… or /api/images/…"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="btn btn-stroke shrink-0"
                  >
                    {imageUploading ? 'Uploading…' : 'Upload'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                </div>
                {formData.image ? (
                  <div className="mt-2 border border-rule bg-paper-strong p-2">
                    <img src={formData.image} alt="Preview" className="max-h-40 w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="file-index-sm truncate">{formData.image}</span>
                      <button type="button" onClick={() => setFormData((p) => ({ ...p, image: '' }))} className="filigree text-[12px]">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="file-index-sm mt-1">JPEG/PNG/WebP ≤5MB – stored in GridFS, served at /api/images/:id</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted" htmlFor="f-content">
                  Content (markdown)
                </label>
                <textarea
                  id="f-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="8"
                  className={fieldClass}
                  placeholder={'# Record title\n\nCase notes in markdown…'}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex flex-row-reverse gap-3">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Saving…' : projectId ? 'Save amendments' : 'File record'}
              </button>
              <button type="button" onClick={onClose} className="btn btn-stroke">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormDrawer;
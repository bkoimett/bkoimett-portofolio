import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/authContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminSettings from './AdminSettings';
import ProjectsTable from '../components/admin/ProjectsTable';
import ProjectFormDrawer from '../components/admin/ProjectFormDrawer';
import BlogsTable from '../components/admin/BlogsTable';
import BlogFormDrawer from '../components/admin/BlogFormDrawer';
import TelemetryChart from '../components/admin/TelemetryChart';
import CVsManager from '../components/admin/CVsManager';

const tabs = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'projects', name: 'Projects' },
  { id: 'blogs', name: 'Blogs' },
  { id: 'cvs', name: 'CVs' },
  { id: 'settings', name: 'Settings' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmBlogDeleteId, setConfirmBlogDeleteId] = useState(null);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Failed to load projects');
    }
  };

  const loadBlogs = async () => {
    try {
      const response = await api.get('/admin/blogs');
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Failed to load blogs');
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadProjects(), loadBlogs()]);
      if (!cancelled) setLoading(false);
    };
    loadAll();
    return () => { cancelled = true; };
  }, []);

  const openNewForm = () => {
    setEditingProjectId(null);
    setEditingProject(null);
    setSuccess('');
    setError('');
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setEditingProject(project);
    setSuccess('');
    setError('');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setSuccess('Record deleted');
      setError('');
      await loadProjects();
    } catch {
      setError('Failed to delete record');
    }
    setConfirmDeleteId(null);
  };

  const openNewBlogForm = () => {
    setEditingBlogId(null);
    setEditingBlog(null);
    setSuccess('');
    setError('');
    setShowBlogForm(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setEditingBlog(blog);
    setSuccess('');
    setError('');
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (id) => {
    try {
      await api.delete(`/admin/blogs/${id}`);
      setSuccess('Blog record deleted');
      setError('');
      await loadBlogs();
    } catch {
      setError('Failed to delete blog record');
    }
    setConfirmBlogDeleteId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSaved = async (message) => {
    setSuccess(message);
    setError('');
    await loadProjects();
    await loadBlogs();
  };

  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
  const published = projects.filter((p) => p.status === 'published').length;
  const blogViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;

  return (
    <AdminLayout
      active={activeTab}
      onSelect={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab !== 'settings' && (error || success) && (
        <div className="mb-6 flex flex-col gap-2">
          {error && (
            <p className="border border-stamp bg-paper px-4 py-2.5 font-mono text-[13px] text-stamp">
              {error}
            </p>
          )}
          {success && (
            <p className="border border-registry bg-paper px-4 py-2.5 font-mono text-[13px] text-registry">
              {success}
            </p>
          )}
        </div>
      )}

      {/* Mobile-only tab strip (sidebar hidden below lg) */}
      <nav
        className="mb-6 flex flex-wrap gap-1 border-b border-rule pb-3 lg:hidden"
        aria-label="Console sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em] rounded-[2px] transition-colors ${
              activeTab === tab.id
                ? 'border-registry bg-registry text-on-registry'
                : 'border-rule-strong text-ink-muted hover:text-registry'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="file-index-sm py-16">Opening the console…</p>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <section aria-labelledby="system-overview">
              <header className="border-b border-rule pb-6">
                <p className="file-index-sm">CONSOLE — BK / SYS.</p>
                <h2
                  id="system-overview"
                  className="mt-1 text-heading font-semibold text-ink"
                >
                  System overview
                </h2>
              </header>

              <div className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-3">
                <div className="ledger-row">
                  <p className="file-index-sm">Total projects</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {projects.length}
                  </p>
                  <p className="file-index-sm mt-2">records on file</p>
                </div>
                <div className="ledger-row">
                  <p className="file-index-sm">Portfolio views</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {totalViews}
                  </p>
                  <p className="file-index-sm mt-2">across all records</p>
                </div>
                <div className="ledger-row">
                  <p className="file-index-sm">Live records</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {published}
                  </p>
                  <p className="file-index-sm mt-2">currently published</p>
                </div>
              </div>

              <div className="mt-10 rule-double" />

              <div className="mt-6 grid grid-cols-1 gap-x-10 sm:grid-cols-3">
                <div className="ledger-row">
                  <p className="file-index-sm">Total blog posts</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {blogs.length}
                  </p>
                  <p className="file-index-sm mt-2">records on file</p>
                </div>
                <div className="ledger-row">
                  <p className="file-index-sm">Blog views</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {blogViews}
                  </p>
                  <p className="file-index-sm mt-2">across all posts</p>
                </div>
                <div className="ledger-row">
                  <p className="file-index-sm">Published posts</p>
                  <p className="mt-1 font-serif text-[3.25rem] font-semibold leading-none text-ink">
                    {publishedBlogs}
                  </p>
                  <p className="file-index-sm mt-2">currently live</p>
                </div>
              </div>

              <div className="mt-10">
                <TelemetryChart projects={projects} />
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section aria-labelledby="records-index">
              <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
                <div>
                  <p className="file-index-sm">REGISTRY — BK / PROD.</p>
                  <h2
                    id="records-index"
                    className="mt-1 text-heading font-semibold text-ink"
                  >
                    Project records
                  </h2>
                </div>
                <button type="button" onClick={openNewForm} className="btn btn-primary">
                  File new record
                </button>
              </header>

              <div className="mt-6">
                <ProjectsTable
                  projects={projects}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                />
              </div>
            </section>
          )}

          {activeTab === 'blogs' && (
            <section aria-labelledby="blog-records">
              <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
                <div>
                  <p className="file-index-sm">REGISTRY — BK / BLOG</p>
                  <h2
                    id="blog-records"
                    className="mt-1 text-heading font-semibold text-ink"
                  >
                    Blog records
                  </h2>
                </div>
                <button type="button" onClick={openNewBlogForm} className="btn btn-primary">
                  File new post
                </button>
              </header>

              <div className="mt-6">
                <BlogsTable
                  blogs={blogs}
                  onEdit={handleEditBlog}
                  onDelete={handleDeleteBlog}
                  confirmDeleteId={confirmBlogDeleteId}
                  setConfirmDeleteId={setConfirmBlogDeleteId}
                />
              </div>
            </section>
          )}

          {activeTab === 'cvs' && (
            <CVsManager />
          )}

          {activeTab === 'settings' && (
            <section aria-labelledby="console-settings">
              <AdminSettings />
            </section>
          )}
        </>
      )}

      <ProjectFormDrawer
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        projectId={editingProjectId}
        initialData={editingProject}
        onSaved={(message) => handleSaved(message)}
      />

      <BlogFormDrawer
        isOpen={showBlogForm}
        onClose={() => setShowBlogForm(false)}
        blogId={editingBlogId}
        initialData={editingBlog}
        onSaved={(message) => handleSaved(message)}
      />
    </AdminLayout>
  );
}
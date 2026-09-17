import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/authContext';
import AdminSettings from './AdminSettings';
import ProjectsTable from '../components/admin/ProjectsTable';
import ProjectFormDrawer from '../components/admin/ProjectFormDrawer';

export default function AdminDashboard() {
  /* eslint-disable no-unused-vars */
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'General',
    technologies: [],
    tags: [],
    readTime: '5 min read',
    status: 'draft'
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
        setSuccess('Project updated successfully');
      } else {
        await api.post('/projects', formData);
        setSuccess('Project created successfully');
      }

      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'General',
        technologies: [],
        tags: [],
        readTime: '5 min read',
        status: 'draft'
      });
      setShowForm(false);
      setEditingId(null);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content || '',
      category: project.category,
      technologies: project.technologies,
      tags: project.tags,
      readTime: project.readTime,
      status: project.status
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setSuccess('Project deleted successfully');
      setConfirmDeleteId(null);
      loadProjects();
    } catch {
      setError('Failed to delete project');
      setConfirmDeleteId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch {
      setError('Failed to load projects');
    }
  };

  /* eslint-enable no-unused-vars */

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen overflow-hidden">
        <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant flex flex-col p-2 z-40 transition-all duration-300 md:translate-x-0 sm:translate-x-0">
          <div className="mb-2 border-b border-outline-variant/30">
            <h1 className="font-headline-sm text-headline-sm text-primary font-bold">B. Koimett</h1>
            <p className="font-label-md text-label-md text-on-surface-variant">Admin Console</p>
          </div>

          <div className="mb-2 p-2 bg-primary/10 border border-primary/20 rounded text-xs">
            <span className="material-symbols-outlined text-primary">badge</span>
            <span className="ml-2 text-primary">Active session</span>
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded border ${
                activeTab === 'dashboard'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              } transition-colors`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors`}
            >
              <span className="material-symbols-outlined">folder_open</span>
              <span className="font-label-md text-label-md">Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors`}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </button>
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={() => window.location.href='mailto:koimettb@gmail.com'}
              className="flex items-center gap-2 px-3 py-2 rounded bg-primary/10 border border-primary/20 text-on-surface-variant hover:text-primary transition-colors text-sm"
            >
              <span className="material-symbols-outlined">mail</span>
              Support
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors text-sm group"
            >
              <span className="material-symbols-outlined text-xs">logout</span>
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-64 overflow-y-auto h-screen custom-scrollbar relative">
          <div className="max-w-container-max mx-auto px-gutter py-8 space-y-8">
            {activeTab === 'dashboard' && (
              <section className="space-y-stack-lg" id="dashboard">
                <div className="flex flex-col gap-2">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">System Overview</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Real-time performance metrics and project lifecycle status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  <div className="glass-card rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Projects</span>
                      <span className="material-symbols-outlined text-primary">analytics</span>
                    </div>
                    <div className="text-[48px] font-bold text-primary leading-tight">{projects.length}</div>
                    <div className="flex items-center gap-1 text-primary-container font-label-md text-xs">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      <span>+3 from last month</span>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Portfolio Views</span>
                      <span className="material-symbols-outlined text-primary">visibility</span>
                    </div>
                    <div className="text-[48px] font-bold text-primary leading-tight">
                      {projects.reduce((sum, p) => sum + (p.views || 0), 0)}
                    </div>
                    <div className="flex items-center gap-1 text-primary-container font-label-md text-xs">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      <span>{Math.round((projects.reduce((sum, p) => sum + (p.views || 0), 0) / 10) * 10)}% vs last week</span>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Last Updated</span>
                      <span className="material-symbols-outlined text-primary">history</span>
                    </div>
                    <div className="text-[48px] font-bold text-primary leading-tight">{new Date().toLocaleDateString()}</div>
                    <div className="font-label-md text-xs text-on-surface-variant">ago: Refactored Go backend</div>
                  </div>
                </div>
                <TelemetryChart projects={projects} trend="up" />
              </section>
            )}

            {activeTab === 'projects' && (
              <section className="space-y-stack-md" id="projects">
                <ProjectsTable
                  projects={projects}
                  onDelete={handleDelete}
                />
              </section>
            )}

            {activeTab === 'settings' && (
              <section className="space-y-stack-md" id="settings">
                <AdminSettings />
              </section>
            )}

            {showForm && (
              <ProjectFormDrawer
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSave={handleSubmit}
                projectId={editingId}
                initialData={formData}
              />
            )}
          </div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
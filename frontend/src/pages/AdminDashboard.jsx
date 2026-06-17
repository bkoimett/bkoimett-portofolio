import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAdminToken, logout } from '../utils/auth';
import AdminSettings from './AdminSettings';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/projects`);
      setProjects(response.data);
      setLoading(false);
    } catch {
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      navigate('/admin/login');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects().catch(() => {
      setError('Failed to load projects');
      setLoading(false);
    });
  }, [navigate]);

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
      const token = getAdminToken();

      if (editingId) {
        await axios.put(
          `${apiUrl}/api/projects/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('Project updated successfully');
      } else {
        await axios.post(
          `${apiUrl}/api/projects`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('Project created successfully');
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
      fetchProjects();
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
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = getAdminToken();

      await axios.delete(
        `${apiUrl}/api/projects/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Project deleted successfully');
      fetchProjects();
    } catch {
      setError('Failed to delete project');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* SideNavBar (Authority: JSON & Contextual Logic) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant flex flex-col p-stack-md z-40">
        {/* Brand Header */}
        <div className="mb-stack-lg px-2">
          <h1 className="font-headline-sm text-headline-sm text-primary font-bold">B. Koimett</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Admin Console</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {/* Dashboard (Active) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left w-full ${
              activeTab === 'dashboard' 
                ? 'text-primary bg-primary/10 border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </button>
          {/* Projects */}
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left w-full ${
              activeTab === 'projects' 
                ? 'text-primary bg-primary/10 border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-label-md text-label-md">Projects</span>
          </button>
          {/* Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left w-full ${
              activeTab === 'settings' 
                ? 'text-primary bg-primary/10 border-r-4 border-primary' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-stack-md border-t border-outline-variant/30">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-300 text-left w-full">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-between px-4 py-3 bg-surface-container-highest rounded-lg text-on-surface hover:bg-primary hover:text-on-primary transition-all duration-300 group"
          >
            <span className="font-label-md text-label-md">Logout</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen custom-scrollbar relative">
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg space-y-section-gap">
          {/* Dashboard Overview Section */}
          {activeTab === 'dashboard' && (
            <section className="space-y-stack-lg" id="dashboard">
              <div className="flex flex-col gap-2">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">System Overview</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Real-time performance metrics and project lifecycle status.</p>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                {/* Stat Card 1 */}
                <div className="glass-card rim-light p-stack-lg rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
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

                {/* Stat Card 2 */}
                <div className="glass-card rim-light p-stack-lg rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Portfolio Views</span>
                    <span className="material-symbols-outlined text-primary">visibility</span>
                  </div>
                  <div className="text-[48px] font-bold text-primary leading-tight">1.2k</div>
                  <div className="flex items-center gap-1 text-primary-container font-label-md text-xs">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12% vs last week</span>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="glass-card rim-light p-stack-lg rounded-xl flex flex-col gap-2 hover:bg-surface-container-highest transition-colors duration-300 cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Last Updated</span>
                    <span className="material-symbols-outlined text-primary">history</span>
                  </div>
                  <div className="text-[48px] font-bold text-primary leading-tight">2h</div>
                  <div className="font-label-md text-xs text-on-surface-variant">ago: Refactored Go backend</div>
                </div>
              </div>
            </section>
          )}

          {/* Projects Management Section */}
          {activeTab === 'projects' && (
            <section className="space-y-stack-md" id="projects">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Manage Projects</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Update, edit, or remove entries from the public portfolio.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
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
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Project
                </button>
              </div>

              {/* Projects Form */}
              {showForm && (
                <form onSubmit={handleSubmit} className="post-form">
                  <h2>{editingId ? 'Edit Project' : 'Create New Project'}</h2>

                  {error && <div className="error-message">{error}</div>}

                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Content (Markdown)</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="10"
                      placeholder="# Title\n\nYour markdown content here..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Read Time</label>
                      <input
                        type="text"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.technologies.join(', ')}
                      onChange={(e) => handleArrayInput(e, 'technologies')}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleArrayInput(e, 'tags')}
                      placeholder="javascript, web, tutorial"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="submit-btn">
                      {editingId ? 'Update Project' : 'Create Project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Projects Table (Bento Container) */}
              <div className="glass-card rim-light rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-high border-b border-outline-variant">
                      <tr>
                        <th className="px-gutter py-4 font-label-md text-label-md text-on-surface">Title</th>
                        <th className="px-gutter py-4 font-label-md text-label-md text-on-surface">Category</th>
                        <th className="px-gutter py-4 font-label-md text-label-md text-on-surface">Tech Stack</th>
                        <th className="px-gutter py-4 font-label-md text-label-md text-on-surface">Status</th>
                        <th className="px-gutter py-4 font-label-md text-label-md text-on-surface text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {projects.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-gutter py-5 text-center text-on-surface-variant">
                            No projects yet. Create your first one!
                          </td>
                        </tr>
                      ) : (
                        projects.map(project => (
                          <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-gutter py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-surface-container-highest overflow-hidden">
                                  {project.image && (
                                    <img className="w-full h-full object-cover" src={project.image} alt={project.title} />
                                  )}
                                </div>
                                <span className="font-body-md text-body-md font-semibold">{project.title}</span>
                              </div>
                            </td>
                            <td className="px-gutter py-5">
                              <span className="font-code-sm text-code-sm text-on-surface-variant">{project.category}</span>
                            </td>
                            <td className="px-gutter py-5">
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                  <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary font-label-md text-[10px] rounded border border-primary/20">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-gutter py-5">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${project.status === 'published' ? 'bg-primary' : 'bg-tertiary'}`}></span>
                                <span className="font-label-md text-xs capitalize">{project.status}</span>
                              </div>
                            </td>
                            <td className="px-gutter py-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(project)}
                                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(project._id)}
                                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                                <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
                                  <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Settings Section */}
          {activeTab === 'settings' && (
            <section className="space-y-stack-md" id="settings">
              <AdminSettings />
            </section>
          )}

          {/* Bottom Spacer */}
          <div className="h-20"></div>
        </div>
      </main>
    </div>
  );
}

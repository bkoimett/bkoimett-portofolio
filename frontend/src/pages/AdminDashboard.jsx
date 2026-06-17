import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAdminToken, logout } from '../utils/auth';
import AdminSettings from './AdminSettings';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
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
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="admin-content">
        <div className="admin-sidebar">
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
            className="new-post-btn"
          >
            + New Post
          </button>
        </div>

        <div className="admin-main">
          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab('posts')}
              className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            >
              📝 Posts
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              ⚙️ Settings
            </button>
          </div>

          {activeTab === 'posts' && (
            <>
              {showForm && (
                <form onSubmit={handleSubmit} className="post-form">
                  <h2>{editingId ? 'Edit Post' : 'Create New Post'}</h2>

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
                      {editingId ? 'Update Post' : 'Create Post'}
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

              <div className="projects-list">
                <h2>All Posts ({projects.length})</h2>
                {projects.length === 0 ? (
                  <p className="no-projects">No posts yet. Create your first one!</p>
                ) : (
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project._id}>
                          <td className="title-cell">{project.title}</td>
                          <td>
                            <span className={`status-badge ${project.status}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>{project.category}</td>
                          <td className="actions">
                            <button
                              onClick={() => handleEdit(project)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <AdminSettings />
          )}
        </div>
      </div>
    </div>
  );
}

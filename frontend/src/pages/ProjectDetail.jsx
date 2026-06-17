import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../styles/ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${apiUrl}/api/projects/slug/${slug}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-detail">
      <button onClick={() => navigate('/projects')} className="back-btn">
        ← Back to Projects
      </button>

      <article className="blog-post">
        {/* Hero Section */}
        {project.image && (
          <img src={project.image} alt={project.title} className="hero-image" />
        )}

        {/* Header */}
        <header className="post-header">
          <h1>{project.title}</h1>
          <p className="description">{project.description}</p>

          {/* Metadata */}
          <div className="post-meta">
            {project.publishDate && (
              <span className="date">
                📅 {new Date(project.publishDate).toLocaleDateString()}
              </span>
            )}
            {project.readTime && (
              <span className="read-time">⏱️ {project.readTime}</span>
            )}
            {project.category && (
              <span className="category">📁 {project.category}</span>
            )}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="post-content">
          {project.content ? (
            <ReactMarkdown>{project.content}</ReactMarkdown>
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="technologies">
            <h3>Technologies Used</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View on GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Live Demo
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
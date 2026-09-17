import { useParams, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import StatusBadge from '../components/primitives/StatusBadge';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewCountRef = useRef(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data);
        viewCountRef.current = response.data.views || 0;
      } catch {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center py-12">Loading project...</div>;
  if (error) return <div className="min-h-screen text-center py-12">Project not found</div>;
  if (!project) return <div className="min-h-screen text-center py-12">Project not found</div>;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12">
      <StatusBadge>{project.views ? `${project.views} views` : '0 views'}</StatusBadge>

      <article className="prose max-w-none">
        {/* Hero Section */}
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="rounded-lg w-full h-64 object-cover mb-6"
          />
        )}

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-on-surface mb-2">{project.title}</h1>
          <p className="text-on-surface-variant mb-4">{project.description}</p>

          {/* Metadata bar with Material Symbols (no emoji) */}
          <div className="flex flex-col sm:flex-row gap-2 text-on-surface-variant text-sm">
            {project.publishDate && (
              <span>
                <span className="material-symbols-outlined text-primary text-xs">calendar_today</span>
                {new Date(project.publishDate).toLocaleDateString()}
              </span>
            )}
            {project.readTime && (
              <span>
                <span className="material-symbols-outlined text-primary text-xs">access_time</span>
                {project.readTime}
              </span>
            )}
            {project.category && (
              <span>
                <span className="material-symbols-outlined text-primary text-xs">folder_open</span>
                {project.category}
              </span>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div>
          {project.content ? (
            <ReactMarkdown>{project.content}</ReactMarkdown>
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-6">
            <h2 className="text-headline-md text-on-surface font-semibold mb-3">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-pill px-3 py-1 rounded text-[12px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="mt-6">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-colors duration-200"
            >
              View on GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary text-primary px-4 py-2 rounded-lg font-medium hover:text-primary transition-colors duration-200"
            >
              Live Demo
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
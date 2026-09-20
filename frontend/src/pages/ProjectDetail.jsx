import { useParams, useState, useEffect, useRef, Link } from 'react';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import StatusBadge from '../components/primitives/StatusBadge';

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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

  if (loading) {
    return (
      <div className="container-page py-24">
        <p className="file-index-sm">Opening the file…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container-page py-24">
        <p className="file-index-sm">REF. NOT FOUND — 404</p>
        <h1 className="mt-2 text-heading-xl font-semibold text-ink">
          Not on record
        </h1>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          This case file does not exist. It may have been moved or never filed.
        </p>
        <Link to="/projects" className="btn btn-primary mt-6">
          Return to the index
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry"
      >
        <span aria-hidden="true">←</span> Project index
      </Link>

      <article className="mt-8 max-w-[72ch]">
        <header className="border-b border-rule pb-8">
          <div className="file-index-sm flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{project.views ? formatDate(new Date()) : 'FILE OPEN'}</span>
            {project.publishDate && (
              <span>FILED {formatDate(project.publishDate)}</span>
            )}
            {project.category && <span>DIVISION: {project.category}</span>}
          </div>

          <h1 className="mt-3 text-heading-xl font-semibold text-ink">
            {project.title}
          </h1>
          <p className="mt-3 text-body text-ink-muted">{project.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge>{project.views ? `${project.views} views` : '0 views'}</StatusBadge>
            {project.readTime && <StatusBadge>{project.readTime}</StatusBadge>}
          </div>
        </header>

        {project.image && (
          <img
            src={project.image}
            alt=""
            className="mt-8 w-full border border-rule object-cover"
          />
        )}

        {project.content ? (
          <div className="markdown-body mt-8">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="mt-8 text-body text-ink-muted">{project.description}</p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-10 border-t border-rule pt-6">
            <h2 className="file-index-sm uppercase tracking-[0.12em]">
              In the build
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[13px] text-ink">
              {project.technologies.map((tech) => (
                <span key={tech}>· {tech}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4 border-t border-rule pt-6">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Source
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-stroke"
            >
              Live deployment
            </a>
          )}
          <Link to="/projects" className="btn btn-ghost">
            Back to index
          </Link>
        </div>
      </article>
    </div>
  );
}
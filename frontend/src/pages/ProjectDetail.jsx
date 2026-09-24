import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import StatusBadge from '../components/primitives/StatusBadge';
import ExpandableImage from '../components/primitives/ExpandableImage';

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

function resolveImage(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith('/api/')) {
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '');
    if (base && base.startsWith('http')) return `${base}${src}`;
    return src;
  }
  return src;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewCountRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setProject(null);
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/slug/${slug}`, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setProject(response.data);
          viewCountRef.current = response.data.views || 0;
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError('Project not found');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchProject();
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (project?._id && viewCountRef.current !== project._id) {
      viewCountRef.current = project._id;
      const ctrl = new AbortController();
      api.post(`/projects/${project._id}`, {}, { signal: ctrl.signal }).catch(() => {});
      return () => ctrl.abort();
    }
  }, [project]);

  if (loading) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-[72ch]">
          <p className="file-index-sm">Opening the file…</p>
          <div className="mt-6 h-8 w-2/3 animate-pulse bg-paper-strong" />
          <div className="mt-4 h-4 w-full animate-pulse bg-paper-strong" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-[72ch] text-center">
          <p className="file-index-sm">REF. NOT FOUND – 404</p>
          <h1 className="mt-3 text-heading-xl font-semibold text-ink">Not on record</h1>
          <p className="mt-3 text-body text-ink-muted">This case file does not exist. It may have been moved or never filed.</p>
          <Link to="/projects" className="btn btn-primary mt-8">Return to the index</Link>
        </div>
      </div>
    );
  }

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: resolveImage(project.image) || `${SITE_URL}/og-cover.png`,
    author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett' },
    applicationCategory: project.category || 'WebApplication',
    operatingSystem: 'Web',
    keywords: (project.technologies || []).join(', '),
  };

  const imgSrc = resolveImage(project.image);

  return (
    <div className="container-page py-14">
      <SEO
        title={project.title}
        description={project.description}
        canonical={`/projects/${project.slug}`}
        image={imgSrc || `${SITE_URL}/og-cover.png`}
        type="article"
        keywords={`${(project.technologies || []).join(', ')}, ${project.category}, Benjamin Koimett`}
        jsonLd={projectJsonLd}
      />

      <div className="mx-auto max-w-[72ch]">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry"
        >
          <span aria-hidden="true">←</span> Project index
        </Link>

        <article className="mt-8">
          {/* Symmetrical header – identical rhythm to BlogDetail */}
          <header className="border-y border-rule py-8">
            <div className="file-index-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center md:justify-start md:text-left">
              <span>BK / PROD.</span>
              <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
              <span>{project.views != null ? `${project.views} views` : 'FILE OPEN'}</span>
              {project.publishDate && (
                <>
                  <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
                  <span>FILED {formatDate(project.publishDate)}</span>
                </>
              )}
              {project.category && (
                <>
                  <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
                  <span>DIV. {project.category}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-center text-heading-xl font-semibold leading-tight text-ink md:text-left">{project.title}</h1>
            <p className="mx-auto mt-3 max-w-[62ch] text-center text-body text-ink-muted md:mx-0 md:text-left">{project.description}</p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <StatusBadge>{project.views ? `${project.views} views` : '0 views'}</StatusBadge>
              {project.readTime && <StatusBadge>{project.readTime}</StatusBadge>}
              {project.category && <StatusBadge>{project.category}</StatusBadge>}
            </div>
          </header>

          {/* Symmetrical figure – framed, same as BlogDetail */}
          <figure className="mt-8 border border-rule bg-paper-strong p-2">
            {imgSrc ? (
              <ExpandableImage
                src={imgSrc}
                alt={project.title}
                caption={`BK-PROD-${project.slug}`}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center border border-dashed border-rule-strong bg-paper">
                <span className="file-index-sm text-center">No figure on file – add title image in console</span>
              </div>
            )}
            <figcaption className="flex items-center justify-between px-2 pt-2">
              <span className="file-index-sm">FIG. BK-PROD – {project.slug}</span>
              <span className="file-index-sm">{project.technologies?.length ? `${project.technologies.length} tools` : '–'}</span>
            </figcaption>
          </figure>

          {project.content ? (
            <div className="markdown-body mt-8">
              <ReactMarkdown>{project.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="mt-8 text-body text-ink-muted">{project.description}</p>
          )}

          {/* Symmetrical meta ledger */}
          {project.technologies?.length > 0 && (
            <div className="mt-10 border-y border-rule py-6">
              <h2 className="file-index-sm text-center uppercase tracking-[0.12em] md:text-left">In the build</h2>
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-mono text-[13px] text-ink md:justify-start">
                {project.technologies.map((tech) => (
                  <span key={tech} className="border border-rule px-2.5 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/projects" className="btn btn-stroke">
              ← Back to index
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Source
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-stroke">
                  Live deployment
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 rule-double" />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted md:justify-between">
            <span>Ref. BK / PROD – {project.slug}</span>
            <div className="flex gap-4">
              <Link to="/blog" className="filigree">
                Filed notes →
              </Link>
              <span className="text-rule-strong">·</span>
              <Link to="/about" className="filigree">
                Personnel →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

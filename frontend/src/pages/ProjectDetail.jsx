import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import RecordFigure from '../components/primitives/RecordFigure';
import { resolveImage } from '../utils/images';
import CaseNotes from '../components/primitives/CaseNotes';
import { SkeletonSheet } from '../components/primitives/Skeleton';

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

/* BK-026-041 – a stable reference number derived from the record's own slug,
   so the same case file is numbered the same way everywhere it appears. */
const referenceNo = (slug = '') => {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return `BK-026-${String((h % 900) + 100)}`;
};

const availability = (project) => {
  if (project.demo) return { label: 'Live deployment', value: 'In service' };
  if (project.github) return { label: 'Source', value: 'Filed' };
  return { label: 'Availability', value: 'File only' };
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewedRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setProject(null);

    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/slug/${slug}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setProject(response.data);
      } catch (err) {
        if (controller.signal.aborted || err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError('This case file is not in the index.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProject();
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (project?._id && viewedRef.current !== project._id) {
      viewedRef.current = project._id;
      const controller = new AbortController();
      api.post(`/projects/${project._id}/view`, {}, { signal: controller.signal }).catch(() => {});
      return () => controller.abort();
    }
    return undefined;
  }, [project]);

  if (loading) return <SkeletonSheet label="Opening the case file" />;

  if (error || !project) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-[62ch]">
          <p className="file-index-sm">Ref. 404 – not in the index</p>
          <h1 className="mt-2 text-heading-xl font-semibold text-ink">Not on record</h1>
          <p className="mt-3 text-body text-ink-muted">
            No case file answers to this reference. It may have been renamed, or the
            record may never have been filed. The index below lists everything that has.
          </p>
          <Link to="/projects" className="btn btn-primary mt-8">
            Open the project index
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = resolveImage(project.image);
  const filed = formatDate(project.publishDate);
  const regNo = referenceNo(project.slug);
  const status = availability(project);

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: imgSrc || `${SITE_URL}/og-cover.png`,
    author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett' },
    applicationCategory: project.category || 'WebApplication',
    operatingSystem: 'Web',
    keywords: (project.technologies || []).join(', '),
  };

  return (
    <div className="container-page pt-10 pb-24">
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
          className="filigree font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted"
        >
          <span aria-hidden="true">←</span> Project index
        </Link>

        <article className="mt-8">
          <header>
            <p className="file-index-sm">
              {regNo}
              {project.category && <> · {project.category}</>}
              {filed && <> · Filed {filed}</>}
            </p>

            <h1 className="mt-3 text-heading-xl font-semibold leading-[1.08] text-ink">
              {project.title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-body text-ink-muted">{project.description}</p>
          </header>

          <figure className="mt-8">
            <RecordFigure
              project={project}
              figureNo={regNo}
              expandable
              imageClassName="aspect-[16/9] w-full border border-rule object-cover"
            />
          </figure>

          <CaseNotes project={project} />

          {project.technologies?.length > 0 && (
            <div className="mt-10">
              <h2 className="file-index-sm border-b border-rule pb-2">Built with</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-rule px-2.5 py-1 font-mono text-[12px] text-ink-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 border-y border-rule py-6">
            <h2 className="file-index-sm">Record</h2>
            <div className="record-grid mt-2">
              <div className="record-cell">
                <p className="file-index-sm">Reference</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">{regNo}</p>
              </div>
              <div className="record-cell">
                <p className="file-index-sm">{status.label}</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">{status.value}</p>
              </div>
              <div className="record-cell">
                <p className="file-index-sm">Division</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">{project.category || 'General'}</p>
              </div>
              <div className="record-cell">
                <p className="file-index-sm">Tools on file</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">
                  {String(project.technologies?.length || 0).padStart(2, '0')}
                </p>
              </div>
              <div className="record-cell">
                <p className="file-index-sm">Filed</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">{filed || 'Not dated'}</p>
              </div>
              <div className="record-cell">
                <p className="file-index-sm">Reads</p>
                <p className="mt-0.5 font-mono text-[13px] text-ink">
                  {project.views != null ? String(project.views) : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/projects" className="btn btn-stroke">
              <span aria-hidden="true">←</span> Back to the index
            </Link>
            <div className="flex flex-wrap gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Read the source
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-stroke"
                >
                  Open the deployment
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import ProjectCard from '../components/primitives/ProjectCard';
import { SkeletonIndex } from '../components/primitives/Skeleton';
import { fallbackProjects } from '../data/fallbackRecords';

const preferredCategories = ['Web Dev', 'Blockchain', 'PWA', 'Backend', 'Dev Tooling', 'Hackathon'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects', { signal: controller.signal });
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        setProjects(fallbackProjects);
        setOffline(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const knownCategories = new Set(projects.map((p) => p.category).filter(Boolean));
  const categories = [
    'all',
    ...preferredCategories.filter((c) => knownCategories.has(c)),
    ...[...knownCategories].filter((c) => !preferredCategories.includes(c)),
  ];

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const projectsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Project records – Benjamin K. Koimett',
    description:
      'Production systems shipped by Benjamin K. Koimett – healthcare, land governance, agriculture and developer tooling.',
    url: `${SITE_URL}/projects`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredProjects.slice(0, 8).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/projects/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <SEO
        title="Project records – MERN & Full-Stack Case Files"
        description="Browse the project records of Benjamin K. Koimett – CareFacility, LandLedger, Argus, Klimatt and other production systems in React, Node.js, Go and TypeScript, each with a written case file."
        canonical="/projects"
        keywords="Benjamin Koimett projects, React Node.js portfolio, MERN projects, CareFacility, LandLedger, Kisumu developer"
        jsonLd={projectsJsonLd}
      />
      <section className="container-page pt-14 pb-24">
        <header className="border-b border-rule pb-10">
          <p className="file-index-sm">BK / PROD. – Full index</p>
          <h1 className="mt-1 text-heading-xl font-semibold text-ink">Project records</h1>
          <p className="mt-3 max-w-[62ch] text-body text-ink-muted">
            Systems shipped in healthcare, land governance, agriculture and developer
            tooling. Each record opens a case file with the decisions behind it.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-rule pb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`rounded-[2px] border px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors ${
                  filter === cat
                    ? 'border-registry bg-registry text-on-registry'
                    : 'border-rule-strong text-ink-muted hover:border-registry hover:text-registry'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
            {loading
              ? 'Counting records…'
              : `${filteredProjects.length} ${filteredProjects.length === 1 ? 'record' : 'records'} on file`}
          </p>
        </div>

        <div className="mt-2">
          {loading ? (
            <SkeletonIndex rows={5} label="Pulling project records" />
          ) : filteredProjects.length === 0 ? (
            <div className="border border-dashed border-rule-strong px-6 py-12">
              <p className="text-body text-ink">
                No records are filed under {filter}.
              </p>
              <p className="mt-1 text-body-sm text-ink-muted">
                Clear the division to see the whole index.
              </p>
              <button type="button" onClick={() => setFilter('all')} className="btn btn-stroke mt-5">
                Show all divisions
              </button>
            </div>
          ) : (
            <>
              {offline && (
                <p className="file-index-sm border-b border-rule py-3">
                  The registry is not reachable from this device. These are the records
                  held locally.
                </p>
              )}
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  regNo={`BK-${String(i + 1).padStart(3, '0')}`}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;

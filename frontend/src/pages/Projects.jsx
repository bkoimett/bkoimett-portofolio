import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProjectCard from '../components/primitives/ProjectCard';

const fallbackProjects = [
  {
    _id: '1',
    slug: 'carefacility-platform',
    title: 'CareFacility Platform',
    description: 'Full-stack healthcare management system serving The Serenity Place rehabilitation center.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format',
    technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
    github: 'https://github.com/bkoimett/carefacility',
    demo: 'https://theserenityplace.vercel.app',
  },
  {
    _id: '2',
    slug: 'landledger',
    title: 'LandLedger — blockchain title deed verification',
    description: 'Immutable title deed verification platform preventing land fraud across East Africa.',
    category: 'Blockchain',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format',
    technologies: ['TypeScript', 'Golang', 'Solana', 'Smart Contracts'],
    github: 'https://github.com/bkoimett/land-ledge',
  },
  {
    _id: '3',
    slug: 'kijiji-corporate-cuisine',
    title: 'Kijiji Corporate Cuisine',
    description: 'Responsive food blog platform with an admin dashboard for content publishing.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format',
    technologies: ['React', 'Node.js'],
    demo: 'https://www.kijijicorporatecuisine.co.ke',
  },
  {
    _id: '4',
    slug: 'agrisync',
    title: 'AgriSync — offline-first farming PWA',
    description: 'Offline-first farming PWA for low-connectivity regions with FAO data integration.',
    category: 'PWA',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format',
    technologies: ['PWA', 'Offline-first'],
  },
];

const categories = ['all', 'Web Dev', 'Blockchain', 'PWA'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects', {
          signal: controller.signal,
        });
        setProjects(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setProjects(fallbackProjects);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className="container-page pt-14 pb-24">
        <header className="border-b border-rule pb-10">
          <p className="file-index-sm">BK / PROD. — FULL INDEX</p>
          <h1 className="mt-1 text-heading-xl font-semibold text-ink">
            Project records
          </h1>
          <p className="mt-3 max-w-[62ch] text-body text-ink-muted">
            Production applications shipped across healthcare, land
            governance, agriculture, and Web3. Each record links to the filed
            case notes.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`border px-4 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors rounded-[2px] ${
                filter === cat
                  ? 'border-registry bg-registry text-on-registry'
                  : 'border-rule-strong text-ink-muted hover:border-registry hover:text-registry'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="file-index-sm py-10">Opening the index…</p>
          ) : filteredProjects.length === 0 ? (
            <p className="file-index-sm py-10">No records match this division.</p>
          ) : (
            filteredProjects.map((project, i) => (
              <ProjectCard
                key={project._id}
                project={project}
                regNo={`BK-${String(i + 1).padStart(3, '0')}`}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;
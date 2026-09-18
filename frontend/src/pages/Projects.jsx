import { useState, useEffect } from 'react';
import api from '../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Web Dev', 'Blockchain', 'PWA'];

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects', {
          signal: controller.signal
        });
        setProjects(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error('Error fetching projects:', error);
          // Fallback data while API is unreachable
          setProjects([
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
            title: 'LandLedger — Blockchain Title Deed Verification',
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
            title: 'AgriSync — Offline-First Farming PWA',
            description: 'Offline-first farming PWA for low-connectivity regions with FAO data integration.',
            category: 'PWA',
            image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format',
            technologies: ['PWA', 'Offline-first'],
          },
        ]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      {/* Main Content */}
      <main className="pt-32 pb-24 max-w-container-max mx-auto px-gutter">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="font-display-lg text-ink mb-3">Featured Projects</h1>
          <p className="text-muted max-w-2xl">
            Production applications shipped across healthcare, land governance, agriculture, and Web3.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-label-md transition-all ${
                filter === cat
                  ? 'active-filter'
                  : 'text-on-surface-variant hover:bg-surface/50'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            {filteredProjects.map((project) => (
              <article key={project._id} className="card p-stack-lg overflow-hidden flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden mb-4">
                  <img alt={project.title} className="w-full h-full object-cover" src={project.image} />
                  <span className="absolute top-3 left-3 tech-pill px-2.5 py-1 rounded text-sm font-medium">{project.category}</span>
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="font-headline-md text-ink mb-2">{project.title}</h3>
                  <p className="font-body-md text-muted mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-pill px-2.5 py-0.5 rounded text-sm font-medium">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border/20 mt-4">
                    {project.github && (
                      <a className="flex items-center gap-1 font-label-md text-accent hover:underline" href={project.github} target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined text-[16px]">code</span>GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a className="flex items-center gap-1 font-label-md text-accent hover:underline" href={project.demo} target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface border-t border-border/20">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="font-headline-sm text-on-surface font-bold">benjieDev</div>
            <p className="font-label-md text-on-surface-variant">© 2026 Benjamin Kiprotich Koimett. Built with MERN & Go.</p>
          </div>
          <div className="flex gap-6">
            <a className="font-label-md text-on-surface-variant hover:text-accent transition-colors" href="https://github.com/bkoimett" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="font-label-md text-on-surface-variant hover:text-accent transition-colors" href="https://linkedin.com/in/benjaminkoimett" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="font-label-md text-on-surface-variant hover:text-accent transition-colors" href="https://dev.to/bwanachairman" target="_blank" rel="noopener noreferrer">Dev.to</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Projects;
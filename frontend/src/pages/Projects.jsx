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
      <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
        {/* Header Section */}
        <header className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-sm">Featured Projects</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Production applications shipped across healthcare, land governance, agriculture, and Web3.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-stack-sm mb-stack-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full font-label-md transition-all ${
                filter === cat
                  ? 'active-filter'
                  : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {filteredProjects.map((project) => (
              <article key={project._id} className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video">
                  <img alt={project.title} className="w-full h-full object-cover" src={project.image} />
                  <span className="absolute top-4 left-4 tech-pill px-3 py-1 rounded-full font-label-md text-[12px] uppercase">{project.category}</span>
                </div>
                <div className="p-stack-lg flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">{project.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-stack-lg mt-auto">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="font-code-sm text-code-sm tech-pill px-3 py-1 rounded">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-stack-md border-t border-white/5 pt-stack-md">
                    {project.github && (
                      <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.github} target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined text-[20px]">code</span>GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.demo} target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      </>
  );
};

export default Projects;
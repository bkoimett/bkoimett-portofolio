import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Cloud', 'DevOps', 'Web Dev', 'Embedded'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${apiUrl}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Sample data while backend is being built
        setProjects([
          {
            id: 1,
            slug: 'cloud-infrastructure-automation',
            title: 'Cloud Infrastructure Automation',
            description: 'Scalable AWS infrastructure using Terraform and Kubernetes',
            category: 'Cloud',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format',
            technologies: ['Terraform', 'AWS', 'K8s'],
            github: '#',
            liveDemo: '#',
          },
          {
            id: 2,
            slug: 'cicd-pipeline-platform',
            title: 'CI/CD Pipeline Platform',
            description: 'Automated deployment pipeline with Jenkins and ArgoCD',
            category: 'DevOps',
            image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format',
            technologies: ['Jenkins', 'Docker', 'ArgoCD'],
            github: '#',
            liveDemo: '#',
          },
          {
            id: 3,
            slug: 'real-time-dashboard',
            title: 'Real-time Dashboard',
            description: 'Modern dashboard with real-time metrics and alerts',
            category: 'Web Dev',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
            technologies: ['React', 'WebSocket', 'D3'],
            github: '#',
            liveDemo: '#',
          },
          {
            id: 4,
            slug: 'iot-sensor-network',
            title: 'IoT Sensor Network',
            description: 'ESP32-based environmental monitoring system',
            category: 'Embedded',
            image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format',
            technologies: ['ESP32', 'C++', 'MQTT'],
            github: '#',
            liveDemo: '#',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="max-w-container-max mx-auto px-gutter h-16 flex items-center justify-between">
          <div className="font-headline-md text-headline-md font-bold text-on-surface">ExpertMinimalist</div>
          <div className="hidden md:flex items-center gap-stack-lg font-body-md text-body-md">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => 
                `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`
              }
            >
              Projects
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`
              }
            >
              About
            </NavLink>
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:opacity-90 transition-all active:scale-95 duration-200">Hire Me</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
        {/* Header Section */}
        <header className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-sm">Featured Projects</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Work I've shipped in production. A selection of full-stack applications, high-performance backends, and decentralized systems.
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
              <article key={project.id} className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video">
                  <img alt="Project preview" className="w-full h-full object-cover" src={project.image} />
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
                    <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.github}>
                      <span className="material-symbols-outlined text-[20px]">code</span>GitHub
                    </a>
                    <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.liveDemo}>
                      <span className="material-symbols-outlined text-[20px]">open_in_new</span>Live Demo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg bg-surface-dim border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="flex flex-col items-center md:items-start gap-stack-sm">
            <div className="font-headline-sm text-headline-sm text-on-surface font-bold">ExpertMinimalist</div>
            <p className="font-label-md text-label-md text-on-surface-variant">© 2024 Benjamin Kiprotich Koimett. Built with MERN & Go.</p>
          </div>
          <div className="flex gap-stack-lg">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Github</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">LinkedIn</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Projects;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Cloud', 'DevOps', 'Web Dev', 'Embedded'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Sample data while backend is being built
        setProjects([
          {
            id: 1,
            title: 'Cloud Infrastructure Automation',
            description: 'Scalable AWS infrastructure using Terraform and Kubernetes',
            category: 'Cloud',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format',
            technologies: ['Terraform', 'AWS', 'K8s'],
          },
          {
            id: 2,
            title: 'CI/CD Pipeline Platform',
            description: 'Automated deployment pipeline with Jenkins and ArgoCD',
            category: 'DevOps',
            image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format',
            technologies: ['Jenkins', 'Docker', 'ArgoCD'],
          },
          {
            id: 3,
            title: 'Real-time Dashboard',
            description: 'Modern dashboard with real-time metrics and alerts',
            category: 'Web Dev',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
            technologies: ['React', 'WebSocket', 'D3'],
          },
          {
            id: 4,
            title: 'IoT Sensor Network',
            description: 'ESP32-based environmental monitoring system',
            category: 'Embedded',
            image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format',
            technologies: ['ESP32', 'C++', 'MQTT'],
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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">
          Featured Projects
        </h2>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                  <button className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                    View Case Study →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
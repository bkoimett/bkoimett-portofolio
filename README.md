I'll help you build a modern portfolio from scratch using the latest Tailwind CSS v4 with Vite. Let's create a clean, minimalistic portfolio with theme switching and backend connection.

## Step 1: Project Setup with Vite

```bash
# Create new Vite project with React
npm create vite@latest my-portfolio -- --template react
cd my-portfolio

# Install Tailwind CSS v4 and the Vite plugin
npm install tailwindcss @tailwindcss/vite
npm install @vitejs/plugin-react

# Install additional dependencies
npm install react-router-dom axios

# Start the development server to verify setup
npm run dev
```

## Step 2: Configure Vite for Tailwind

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## Step 3: Set Up CSS

Replace the content of `src/index.css` with:

```css
@import "tailwindcss";

/* Custom theme variables */
@theme {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Dark mode class - Tailwind v4 handles this automatically with dark: variant */
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}

/* Smooth transitions for theme switching */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

## Step 4: Create Theme Context

Create `src/context/ThemeContext.jsx`:

```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved theme
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Step 5: Create Components

Create `src/components/ThemeToggle.jsx`:

```jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-50 shadow-md"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
```

Create `src/components/Navbar.jsx`:

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/projects' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex justify-center items-center space-x-12">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

## Step 6: Create Pages

Create `src/pages/Home.jsx`:

```jsx
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
          Alex Chen
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Software Engineer specializing in Cloud Infrastructure, DevOps, 
          and Embedded Systems
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['☁️ AWS', '🚀 Kubernetes', '💻 React', '🔧 Embedded C', '📦 Terraform', '🤖 CI/CD'].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <a 
            href="#projects" 
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            View My Work
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
```

Create `src/pages/Projects.jsx`:

```jsx
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
```

Create `src/pages/About.jsx`:

```jsx
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">
          About Me
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I'm a Software Engineer with over 5 years of experience building 
                scalable systems across the entire technology stack. My journey 
                started with embedded systems, evolved through web development, 
                and now focuses on cloud infrastructure and DevOps.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I believe in clean, maintainable code and automation-first approaches. 
                Whether it's optimizing cloud costs, designing CI/CD pipelines, or 
                developing responsive web applications, I strive for excellence in 
                every project.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl text-gray-900 dark:text-white mb-4 font-medium">
                Experience
              </h3>
              <div className="space-y-6">
                {[
                  {
                    role: 'Senior Software Engineer',
                    company: 'TechCorp Inc.',
                    period: '2022 - Present',
                    description: 'Leading cloud infrastructure initiatives and DevOps practices'
                  },
                  {
                    role: 'Full Stack Developer',
                    company: 'InnovateLabs',
                    period: '2020 - 2022',
                    description: 'Developed modern web applications and microservices'
                  },
                  {
                    role: 'Embedded Systems Engineer',
                    company: 'Embedded Solutions',
                    period: '2018 - 2020',
                    description: 'Designed IoT devices and firmware for industrial applications'
                  }
                ].map((job, i) => (
                  <div key={i} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{job.role}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} · {job.period}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Skills & Tools
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cloud & DevOps</h4>
                  <div className="flex flex-wrap gap-2">
                    {['AWS', 'Docker', 'K8s', 'Terraform', 'Jenkins', 'GitHub Actions'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Web Development</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'GraphQL'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Embedded Systems</h4>
                  <div className="flex flex-wrap gap-2">
                    {['C/C++', 'ESP32', 'ARM', 'RTOS', 'I2C/SPI', 'MQTT'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connect</h4>
                <div className="flex space-x-3">
                  {['GitHub', 'LinkedIn', 'Twitter'].map(platform => (
                    <a key={platform} href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
```

## Step 7: Update App Component

Update `src/App.jsx`:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

## Step 8: Create Simple Backend

In the root directory, create a `server` folder:

```bash
mkdir server
cd server
npm init -y
npm install express cors
```

Create `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const projects = [
  {
    id: 1,
    title: 'Cloud Infrastructure Automation',
    description: 'Scalable AWS infrastructure using Terraform and Kubernetes. Implemented multi-region architecture with auto-scaling and disaster recovery.',
    category: 'Cloud',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format',
    technologies: ['Terraform', 'AWS', 'Kubernetes', 'Docker'],
    github: 'https://github.com/username/cloud-infra',
    demo: 'https://demo.example.com',
    highlights: [
      'Reduced infrastructure costs by 40% through optimization',
      'Implemented GitOps workflow with ArgoCD',
      'Achieved 99.99% uptime with multi-region setup'
    ]
  },
  {
    id: 2,
    title: 'CI/CD Pipeline Platform',
    description: 'Automated deployment pipeline with Jenkins and ArgoCD. Features include automated testing, security scanning, and rollback capabilities.',
    category: 'DevOps',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format',
    technologies: ['Jenkins', 'ArgoCD', 'Docker', 'SonarQube'],
    github: 'https://github.com/username/cicd-pipeline',
    highlights: [
      'Reduced deployment time from 2 hours to 15 minutes',
      'Implemented automated security scanning',
      'Zero-downtime deployments with blue-green strategy'
    ]
  },
  {
    id: 3,
    title: 'Real-time Dashboard',
    description: 'Modern React dashboard with real-time metrics and alerts. Built for monitoring cloud infrastructure and application performance.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
    technologies: ['React', 'WebSocket', 'D3.js', 'Express'],
    github: 'https://github.com/username/dashboard',
    demo: 'https://dashboard.demo.com',
    highlights: [
      'Real-time updates with WebSocket connection',
      'Custom data visualizations with D3.js',
      'Dark mode support and responsive design'
    ]
  },
  {
    id: 4,
    title: 'IoT Sensor Network',
    description: 'ESP32-based environmental monitoring system with MQTT and cloud integration. Monitors temperature, humidity, and air quality.',
    category: 'Embedded',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format',
    technologies: ['ESP32', 'C++', 'MQTT', 'AWS IoT'],
    github: 'https://github.com/username/iot-system',
    highlights: [
      'Low-power design with 6 months battery life',
      'Real-time alerts via MQTT and SMS',
      'Over-the-air firmware updates'
    ]
  }
];

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  // Here you would typically send an email or save to database
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Message received!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Step 9: Run the Application

In your main `package.json`, update the scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "cd server && node index.js"
  }
}
```

Now run both:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

Visit `http://localhost:5173` to see your portfolio!

## Features Implemented:

✅ **Modern Tech Stack**: React + Vite + Tailwind CSS v4
✅ **Theme Switching**: Dark/Light mode with system preference detection
✅ **Responsive Design**: Mobile-first approach
✅ **Project Gallery**: Filterable grid with categories
✅ **Backend API**: Express server with project endpoints
✅ **Clean Aesthetic**: Minimalistic design with proper spacing

## Next Steps:

1. **Add project details page** with dynamic routing
2. **Implement contact form** with backend integration
3. **Add animations** with Framer Motion
4. **Create admin panel** for managing projects
5. **Add database** (MongoDB/PostgreSQL)
6. **Deploy** to Vercel (frontend) and Render (backend)

The portfolio is now functional and ready for you to customize with your own content! Would you like me to guide you through implementing any specific feature next?
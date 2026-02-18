const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
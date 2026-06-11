const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Project schema
const projectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  content: String,
  category: String,
  image: String,
  technologies: [String],
  tags: [String],
  readTime: String,
  publishDate: String,
  github: String,
  demo: String,
  highlights: [String],
  status: String
});

const Project = mongoose.model('Project', projectSchema);

const projects = [
  {
    slug: 'cloud-infrastructure-automation',
    title: 'Cloud Infrastructure Automation',
    description: 'Scalable AWS infrastructure using Terraform and Kubernetes. Implemented multi-region architecture with auto-scaling and disaster recovery.',
    content: '## Project Overview\n\nThis project involved designing and implementing a scalable cloud infrastructure on AWS using Infrastructure as Code (IaC) principles with Terraform. The solution features a multi-region architecture with auto-scaling capabilities and comprehensive disaster recovery mechanisms.\n\n### Key Features\n\n- **Multi-region deployment** for high availability\n- **Auto-scaling groups** that adjust to traffic demands\n- **Terraform modules** for reusable infrastructure\n- **Kubernetes clusters** for container orchestration\n- **CI/CD integration** with automated deployments\n\n### Technical Implementation\n\nThe infrastructure was built using Terraform with a modular approach, allowing for easy maintenance and scalability. Each module represents a specific component of the infrastructure, such as VPC, EC2 instances, or Kubernetes clusters.',
    category: 'Cloud',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format',
    technologies: ['Terraform', 'AWS', 'Kubernetes', 'Docker'],
    tags: ['cloud', 'infrastructure', 'terraform', 'kubernetes'],
    readTime: '8 min read',
    publishDate: '2024-01-15',
    github: 'https://github.com/username/cloud-infra',
    demo: 'https://demo.example.com',
    highlights: [
      'Reduced infrastructure costs by 40% through optimization',
      'Implemented GitOps workflow with ArgoCD',
      'Achieved 99.99% uptime with multi-region setup'
    ],
    status: 'published'
  },
  {
    slug: 'cicd-pipeline-platform',
    title: 'CI/CD Pipeline Platform',
    description: 'Automated deployment pipeline with Jenkins and ArgoCD. Features include automated testing, security scanning, and rollback capabilities.',
    content: '## CI/CD Pipeline Implementation\n\nBuilt a robust CI/CD pipeline using Jenkins for continuous integration and ArgoCD for continuous deployment. The pipeline includes automated testing, security scanning, and automated rollback capabilities.\n\n### Pipeline Features\n\n- **Automated testing** on every commit\n- **Security scanning** with SonarQube integration\n- **Blue-green deployments** for zero downtime\n- **Automated rollbacks** on failed deployments\n\n### Architecture\n\nThe pipeline is designed to be flexible and scalable, supporting multiple environments and providing comprehensive monitoring and alerting capabilities.',
    category: 'DevOps',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format',
    technologies: ['Jenkins', 'ArgoCD', 'Docker', 'SonarQube'],
    tags: ['devops', 'cicd', 'jenkins', 'argocd'],
    readTime: '6 min read',
    publishDate: '2024-02-20',
    github: 'https://github.com/username/cicd-pipeline',
    highlights: [
      'Reduced deployment time from 2 hours to 15 minutes',
      'Implemented automated security scanning',
      'Zero-downtime deployments with blue-green strategy'
    ],
    status: 'published'
  },
  {
    slug: 'real-time-dashboard',
    title: 'Real-time Dashboard',
    description: 'Modern React dashboard with real-time metrics and alerts. Built for monitoring cloud infrastructure and application performance.',
    content: '## Real-time Monitoring Dashboard\n\nDeveloped a modern React-based dashboard that provides real-time monitoring of cloud infrastructure and application performance metrics. The dashboard uses WebSocket connections for live updates and D3.js for data visualization.\n\n### Key Components\n\n- **Real-time WebSocket** connection for live updates\n- **Interactive charts** built with D3.js\n- **Alert system** for threshold monitoring\n- **Dark mode** support for better UX\n\n### Performance\n\nThe dashboard is optimized for performance with efficient data handling and smooth animations, providing a seamless user experience even with large datasets.',
    category: 'Web Dev',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
    technologies: ['React', 'WebSocket', 'D3.js', 'Express'],
    tags: ['react', 'dashboard', 'websocket', 'd3'],
    readTime: '5 min read',
    publishDate: '2024-03-10',
    github: 'https://github.com/username/dashboard',
    demo: 'https://dashboard.demo.com',
    highlights: [
      'Real-time updates with WebSocket connection',
      'Custom data visualizations with D3.js',
      'Dark mode support and responsive design'
    ],
    status: 'published'
  },
  {
    slug: 'iot-sensor-network',
    title: 'IoT Sensor Network',
    description: 'ESP32-based environmental monitoring system with MQTT and cloud integration. Monitors temperature, humidity, and air quality.',
    content: '## IoT Environmental Monitoring System\n\nDesigned and implemented an ESP32-based environmental monitoring system that tracks temperature, humidity, and air quality. The system uses MQTT for communication and integrates with AWS IoT for cloud data storage and processing.\n\n### System Architecture\n\n- **ESP32 microcontrollers** for sensor data collection\n- **MQTT protocol** for lightweight messaging\n- **AWS IoT Core** for cloud integration\n- **Low-power design** for extended battery life\n\n### Features\n\nThe system provides real-time alerts via MQTT and SMS, with over-the-air firmware updates for easy maintenance and feature additions.',
    category: 'Embedded',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format',
    technologies: ['ESP32', 'C++', 'MQTT', 'AWS IoT'],
    tags: ['iot', 'embedded', 'esp32', 'mqtt'],
    readTime: '7 min read',
    publishDate: '2024-04-05',
    github: 'https://github.com/username/iot-system',
    highlights: [
      'Low-power design with 6 months battery life',
      'Real-time alerts via MQTT and SMS',
      'Over-the-air firmware updates'
    ],
    status: 'published'
  }
];

async function seed() {
  try {
    // Clear existing projects
    await Project.deleteMany({});
    console.log('Deleted existing projects');
    
    // Insert new projects
    await Project.insertMany(projects);
    console.log('Seeded projects');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
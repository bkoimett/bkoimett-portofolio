import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-display-lg text-on-surface mb-6 tracking-tight">
          Benjamin Koimett
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Software Engineer specializing in Cloud Infrastructure, DevOps, 
          and Embedded Systems
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['☁️ AWS', '🚀 Kubernetes', '💻 React', '🔧 Embedded C', '📦 Terraform', '🤖 CI/CD'].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-code-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a 
            href="/projects" 
            className="btn-primary"
          >
            View My Work
          </a>
          <a 
            href="#contact" 
            className="btn-secondary"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

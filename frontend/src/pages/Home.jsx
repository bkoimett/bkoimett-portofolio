import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
          Benjamin Koimett
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
            href="/projects" 
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
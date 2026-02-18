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
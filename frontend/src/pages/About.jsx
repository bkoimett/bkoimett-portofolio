import React from 'react';
import { NavLink } from 'react-router-dom';

const About = () => {
  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="max-w-container-max mx-auto px-gutter h-16 flex items-center justify-between">
          <div className="font-headline-md text-headline-md font-bold text-on-surface">ExpertMinimalist</div>
          <div className="hidden md:flex items-center gap-stack-lg font-body-md text-body-md">
            <NavLink to="/" className={({ isActive }) => `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`}>Home</NavLink>
            <NavLink to="/projects" className={({ isActive }) => `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`}>Projects</NavLink>
            <NavLink to="/about" className={({ isActive }) => `text-on-surface-variant hover:text-primary transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : ''}`}>About</NavLink>
          </div>
          <button className="bg-primary-container text-on-primary-container px-stack-lg py-2 rounded-full font-label-md text-label-md hover:scale-95 duration-200 transition-all">Hire Me</button>
        </div>
      </nav>

      <main className="mt-24">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-gutter pt-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl mb-stack-md text-on-surface">
                Engineering with <span className="text-gradient">Precision.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                I am Benjamin Kiprotich Koimett, a full-stack engineer specializing in the MERN stack and Go. I build high-performance distributed systems with a focus on minimalist design and architectural integrity.
              </p>
            </div>
            <div className="md:col-span-5 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30">
                <img alt="Benjamin Koimett" className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVlxZyJPFXnOKKZ1tQCnomHEEekXd-dELt8fmgbRXNnJqtuDOojaq_3UVgDgrCvNVPbFBTbJQEK3SCI2qu2dlPnK6vcNRI3Y_85F16YggzdfjN12YP2n9LDWoRYUlpktSFcnFNfkhSVCK11qIGEL-iTe-gyRxunSRzYDenyigZjQQjR_2QbBp6SLJzLnbeuaLCCtx4aJZDli37uC9eKbZV7fFFLDZG0lYqWjZRDS0PNxyZKvJuEHRFXJ0ms7ckdOKg22U0SFeX1J0" />
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="max-w-container-max mx-auto px-gutter py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4">
              <h2 className="font-headline-md text-headline-md text-primary sticky top-24">About Me</h2>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-stack-md">
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                  My journey in software engineering is driven by a fascination with how complex systems can be reduced to elegant, performant code. With a background in both front-end aesthetics and back-end robustness, I bridge the gap between user experience and technical feasibility.
                </p>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Currently, I leverage Go for its concurrency primitives and performance, while utilizing the MERN stack to deliver dynamic, responsive web applications. I believe in "Expert Minimalism"—the practice of removing everything that isn't essential until only the most powerful, clear, and efficient solution remains.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="bg-surface-container-low py-section-gap border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">Experience</h2>
                <p className="font-label-md text-label-md text-on-surface-variant mt-stack-sm">The professional journey so far.</p>
              </div>
              <div className="md:col-span-8 space-y-stack-lg">
                {/* Role 1 */}
                <div className="pl-stack-lg border-l-4 border-primary/40 hover:border-primary transition-all duration-300 py-stack-sm">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Senior Software Engineer</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-label-md text-label-md text-primary">Tech Solutions Global</span>
                    <span className="font-label-md text-label-md text-on-surface-variant italic">2022 - Present</span>
                  </div>
                  <ul className="mt-stack-md space-y-2 text-on-surface-variant">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">01</span>
                      <span>Architected a high-throughput microservices architecture using Go, reducing latency by 45%.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">02</span>
                      <span>Led the transition from a monolithic architecture to a containerized MERN stack ecosystem.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">03</span>
                      <span>Mentored junior developers on clean code practices and TDD methodologies.</span>
                    </li>
                  </ul>
                </div>
                {/* Role 2 */}
                <div className="pl-stack-lg border-l-4 border-primary/20 hover:border-primary transition-all duration-300 py-stack-sm">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Full Stack Developer</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-label-md text-label-md text-primary">Creative Logic Labs</span>
                    <span className="font-label-md text-label-md text-on-surface-variant italic">2020 - 2022</span>
                  </div>
                  <ul className="mt-stack-md space-y-2 text-on-surface-variant">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">01</span>
                      <span>Developed and maintained 15+ client projects using React, Node.js, and MongoDB.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">02</span>
                      <span>Implemented automated CI/CD pipelines using GitHub Actions and AWS.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Grid */}
        <section className="max-w-container-max mx-auto px-gutter py-section-gap">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-stack-lg">Technical Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Frontend Card */}
            <div className="bg-surface-container border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">web</span>
                <h3 className="font-headline-md text-headline-md">Frontend</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">React.js</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Next.js</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">TypeScript</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Tailwind CSS</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Framer Motion</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Redux Toolkit</span>
              </div>
            </div>
            {/* Backend Card */}
            <div className="bg-surface-container-high border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">terminal</span>
                <h3 className="font-headline-md text-headline-md">Backend</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Node.js</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Go (Golang)</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Express</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">gRPC</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">PostgreSQL</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Redis</span>
              </div>
            </div>
            {/* DevOps Card */}
            <div className="bg-surface-container border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">cloud</span>
                <h3 className="font-headline-md text-headline-md">DevOps</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Docker</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Kubernetes</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">AWS</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Terraform</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">GitHub Actions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="max-w-container-max mx-auto px-gutter pb-section-gap">
          <div className="glass-panel p-stack-lg rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Let's build something great.</h2>
              <p className="text-on-surface-variant font-body-md text-body-md mt-2">I'm currently available for freelance opportunities and full-time roles.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-stack-md">
              <a className="flex items-center gap-2 text-primary hover:text-white transition-colors" href="mailto:benjamin@koimett.tech">
                <span className="material-symbols-outlined">mail</span>
                <span className="font-label-md text-label-md">Email</span>
              </a>
              <a className="flex items-center gap-2 text-primary hover:text-white transition-colors" href="tel:+254722970951">
                <span className="material-symbols-outlined">call</span>
                <span className="font-label-md text-label-md">Phone</span>
              </a>
              <div className="flex gap-stack-md ml-stack-md border-l border-outline-variant/30 pl-stack-md">
                <a className="text-primary hover:scale-110 transition-transform" href="https://github.com"><span className="material-symbols-outlined">code</span></a>
                <a className="text-primary hover:scale-110 transition-transform" href="https://linkedin.com"><span className="material-symbols-outlined">link</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dim border-t border-outline-variant/30 py-stack-lg">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="font-headline-sm text-headline-sm text-on-surface">ExpertMinimalist</div>
          <div className="font-label-md text-label-md text-on-surface-variant">© 2024 Benjamin Kiprotich Koimett. Built with MERN & Go.</div>
          <div className="flex gap-stack-md">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#">Github</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#">LinkedIn</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
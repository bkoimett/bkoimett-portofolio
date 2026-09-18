const About = () => {
  return (
    <>
      <main className="mt-24">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-gutter pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <h1 className="font-display-xl-mobile md:font-display-xl font-display-xl text-on-surface mb-6">
                Engineering with Precision
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                I am Benjamin Kiprotich Koimett, a full-stack software engineer shipping production
                applications across the MERN stack, Golang, and TypeScript. Based in Kisumu,
                Kenya — remote-ready and available immediately.
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <div className="overflow-hidden rounded-xl border border-border">
                <img alt="Benjamin Koimett" className="w-full aspect-[4/5] object-cover" src="https://res.cloudinary.com/deci4v6zv/image/upload/v1789670149/bkoimett1_asizun.png" />
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="max-w-container-max mx-auto px-gutter py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4"></div>
            <div className="md:col-span-8">
              <div className="space-y-6">
                <p className="font-body-lg text-on-surface leading-relaxed">
                  Full-stack engineer shipping production applications across frontend, backend,
                  and DevOps. I own projects end-to-end — from design through deployment — for
                  live products serving real users in healthcare, agriculture, land governance, and Web3.
                </p>
                <p className="font-body-lg text-on-surface-variant leading-relaxed">
                  I leverage Go for its concurrency primitives and performance, while using the MERN
                  stack to deliver dynamic, responsive web applications. I build with AI tools daily
                  and thrive in fast-moving environments with real responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-24 bg-surface/50">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4"></div>
              <div className="md:col-span-8">
                <h2 className="font-headline-lg text-on-surface mb-8">Experience</h2>
                <p className="font-body-md text-on-surface-variant mb-12">The professional journey so far.</p>

                {/* Role 1 */}
                <div className="mb-12">
                  <h3 className="font-headline-md text-on-surface">Software Engineer</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-label-md text-accent">Zone01 Kisumu</span>
                    <span className="font-label-md text-on-surface-variant">·</span>
                    <span className="font-label-md text-on-surface-variant">Jan 2026 — Present</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-on-surface-variant">
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Shipping full-stack applications with React, Vite, and Golang in a peer-driven 42 Network environment.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Leading technical decisions and code reviews across a cohort of 10+ engineers.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Mentoring engineers on deployment pipelines, AI-assisted development workflows, and Docker containerization.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-border/20 my-8"></div>

                {/* Role 2 */}
                <div className="mb-12">
                  <h3 className="font-headline-md text-on-surface">Junior Frontend Developer</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-label-md text-accent">Occulus Technologies Ltd</span>
                    <span className="font-label-md text-on-surface-variant">·</span>
                    <span className="font-label-md text-on-surface-variant">May 2025 — Dec 2025</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-on-surface-variant">
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Built reusable React components and responsive layouts using Tailwind CSS across 5 client projects.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Integrated REST APIs and managed asynchronous data flows for 1000+ daily active users.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Resolved 50+ issues, improving page load performance by 28% through code splitting and lazy loading.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-border/20 my-8"></div>

                {/* Role 3 */}
                <div>
                  <h3 className="font-headline-md text-on-surface">Manager</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-label-md text-accent">The Serenity Place Treatment Centre</span>
                    <span className="font-label-md text-on-surface-variant">·</span>
                    <span className="font-label-md text-on-surface-variant">Jan 2022 — Apr 2025</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-on-surface-variant">
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Led operations for a rehabilitation facility, managing 30+ staff and 50+ residents.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>Implemented digital record-keeping systems, reducing documentation errors by 60%.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Grid */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-gutter">
            <h2 className="font-headline-lg text-on-surface text-center mb-12">Technical Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-accent">web</span>
                  <h3 className="font-headline-md text-on-surface">Frontend</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tech-pill">React.js</span>
                  <span className="tech-pill">Next.js</span>
                  <span className="tech-pill">TypeScript</span>
                  <span className="tech-pill">Tailwind CSS</span>
                  <span className="tech-pill">Progressive Web Apps</span>
                </div>
              </div>
              <div className="card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-accent">terminal</span>
                  <h3 className="font-headline-md text-on-surface">Backend & APIs</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tech-pill">Node.js</span>
                  <span className="tech-pill">Go (Golang)</span>
                  <span className="tech-pill">Express.js</span>
                  <span className="tech-pill">REST API Design</span>
                  <span className="tech-pill">JWT Auth</span>
                  <span className="tech-pill">WebSocket</span>
                </div>
              </div>
              <div className="card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-accent">cloud</span>
                  <h3 className="font-headline-md text-on-surface">Data & DevOps</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tech-pill">MongoDB</span>
                  <span className="tech-pill">PostgreSQL</span>
                  <span className="tech-pill">Docker</span>
                  <span className="tech-pill">GitHub Actions</span>
                  <span className="tech-pill">Vercel</span>
                  <span className="tech-pill">Render</span>
                </div>
              </div>
              <div className="card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-accent">database</span>
                  <h3 className="font-headline-md text-on-surface">Blockchain & Web3</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tech-pill">Solana</span>
                  <span className="tech-pill">Poly Amoy</span>
                  <span className="tech-pill">Smart Contracts</span>
                  <span className="tech-pill">Title Deed Verification</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="panel p-8 rounded-xl border border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="font-headline-lg text-on-surface mb-2">Let's build something great.</h2>
                <p className="text-on-surface-variant">I'm currently available for freelance opportunities and full-time roles.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a className="flex items-center gap-2 text-accent hover:opacity-110 transition-opacity" href="mailto:koimettb@gmail.com">
                  <span className="material-symbols-outlined">mail</span>
                  <span className="font-label-md">Email</span>
                </a>
                <a className="flex items-center gap-2 text-accent hover:opacity-110 transition-opacity" href="tel:+254722970951">
                  <span className="material-symbols-outlined">call</span>
                  <span className="font-label-md">Phone</span>
                </a>
                <div className="flex gap-3 ml-3 border-l border-border pl-3">
                  <a className="text-accent hover:scale-110 transition-transform" href="https://github.com/bkoimett" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">code</span></a>
                  <a className="text-accent hover:scale-110 transition-transform" href="https://linkedin.com/in/benjaminkoimett" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">link</span></a>
                  <a className="text-accent hover:scale-110 transition-transform" href="https://dev.to/bwanachairman" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">article</span></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border/20 py-12">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-headline-sm text-on-surface font-bold">benjieDev</div>
          <div className="font-label-md text-on-surface-variant">© 2026 Benjamin Kiprotich Koimett. Built with MERN & Go.</div>
          <div className="flex gap-6">
            <a className="text-on-surface-variant hover:text-accent transition-colors font-label-md" href="https://github.com/bkoimett" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-on-surface-variant hover:text-accent transition-colors font-label-md" href="https://linkedin.com/in/benjaminkoimett" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-on-surface-variant hover:text-accent transition-colors font-label-md" href="https://dev.to/bwanachairman" target="_blank" rel="noopener noreferrer">Dev.to</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
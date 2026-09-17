const About = () => {
  return (
    <>
      <main className="mt-24">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-gutter pt-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl mb-stack-md text-on-surface">
                Engineering with <span className="text-gradient">Precision.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                I am Benjamin Kiprotich Koimett, a full-stack software engineer shipping production applications across the MERN stack, Golang, and TypeScript. Based in Kisumu, Kenya — remote-ready and available immediately.
              </p>
            </div>
            <div className="md:col-span-5 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30">
                <img alt="Benjamin Koimett" className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://res.cloudinary.com/deci4v6zv/image/upload/v1789670149/bkoimett1_asizun.png" />
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
                  Full-stack engineer shipping production applications across frontend, backend, and DevOps. I own projects end-to-end — from design through deployment — for live products serving real users in healthcare, agriculture, land governance, and Web3.
                </p>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  I leverage Go for its concurrency primitives and performance, while using the MERN stack to deliver dynamic, responsive web applications. I build with AI tools daily and thrive in fast-moving environments with real responsibility.
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
                  <h3 className="font-headline-md text-headline-md text-on-surface">Software Engineer</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-label-md text-label-md text-primary">Zone01 Kisumu</span>
                    <span className="font-label-md text-label-md text-on-surface-variant italic">Jan 2026 - Present</span>
                  </div>
                  <ul className="mt-stack-md space-y-2 text-on-surface-variant">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">01</span>
                      <span>Shipping full-stack applications with React, Vite, and Golang in a peer-driven 42 Network environment.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">02</span>
                      <span>Leading technical decisions and code reviews across a cohort of 10+ engineers.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">03</span>
                      <span>Mentoring engineers on deployment pipelines, AI-assisted development workflows, and Docker containerization.</span>
                    </li>
                  </ul>
                </div>
                {/* Role 2 */}
                <div className="pl-stack-lg border-l-4 border-primary/40 hover:border-primary transition-all duration-300 py-stack-sm">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Junior Frontend Developer</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-label-md text-label-md text-primary">Occulus Technologies Ltd</span>
                    <span className="font-label-md text-label-md text-on-surface-variant italic">May 2025 - Dec 2025</span>
                  </div>
                  <ul className="mt-stack-md space-y-2 text-on-surface-variant">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">01</span>
                      <span>Built reusable React components and responsive layouts using Tailwind CSS across 5 client projects.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">02</span>
                      <span>Integrated REST APIs and managed asynchronous data flows for 1000+ daily active users.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">03</span>
                      <span>Resolved 50+ issues, improving page load performance by 28% through code splitting and lazy loading.</span>
                    </li>
                  </ul>
                </div>
                {/* Role 3 */}
                <div className="pl-stack-lg border-l-4 border-primary/20 hover:border-primary transition-all duration-300 py-stack-sm">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Manager</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-label-md text-label-md text-primary">The Serenity Place Treatment Centre</span>
                    <span className="font-label-md text-label-md text-on-surface-variant italic">Jan 2022 - Apr 2025</span>
                  </div>
                  <ul className="mt-stack-md space-y-2 text-on-surface-variant">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">01</span>
                      <span>Led operations for a rehabilitation facility, managing 30+ staff and 50+ residents.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">02</span>
                      <span>Implemented digital record-keeping systems, reducing documentation errors by 60%.</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
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
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Progressive Web Apps</span>
              </div>
            </div>
            {/* Backend Card */}
            <div className="bg-surface-container-high border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">terminal</span>
                <h3 className="font-headline-md text-headline-md">Backend & APIs</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Node.js</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Go (Golang)</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Express.js</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">REST API Design</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">JWT Auth</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">WebSocket</span>
              </div>
            </div>
            {/* Data & DevOps Card */}
            <div className="bg-surface-container border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">cloud</span>
                <h3 className="font-headline-md text-headline-md">Data & DevOps</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">MongoDB</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">PostgreSQL</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Docker</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">GitHub Actions</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Vercel</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Render</span>
              </div>
            </div>
            {/* Blockchain Card */}
            <div className="bg-surface-container-high border border-outline-variant/30 p-stack-lg rounded-xl flex flex-col h-full">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">database</span>
                <h3 className="font-headline-md text-headline-md">Blockchain & Web3</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Solana</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Poly Amoy</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Smart Contracts</span>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-md text-label-md">Title Deed Verification</span>
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
              <a className="flex items-center gap-2 text-primary hover:text-white transition-colors" href="mailto:koimettb@gmail.com">
                <span className="material-symbols-outlined">mail</span>
                <span className="font-label-md text-label-md">Email</span>
              </a>
              <a className="flex items-center gap-2 text-primary hover:text-white transition-colors" href="tel:+254722970951">
                <span className="material-symbols-outlined">call</span>
                <span className="font-label-md text-label-md">Phone</span>
              </a>
              <div className="flex gap-stack-md ml-stack-md border-l border-outline-variant/30 pl-stack-md">
                <a className="text-primary hover:scale-110 transition-transform" href="https://github.com/bkoimett" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">code</span></a>
                <a className="text-primary hover:scale-110 transition-transform" href="https://linkedin.com/in/benjaminkoimett" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">link</span></a>
                <a className="text-primary hover:scale-110 transition-transform" href="https://dev.to/bwanachairman" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">article</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dim border-t border-outline-variant/30 py-stack-lg">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="font-headline-sm text-headline-sm text-on-surface">benjieDev</div>
          <div className="font-label-md text-label-md text-on-surface-variant">© 2026 Benjamin Kiprotich Koimett. Built with MERN & Go.</div>
          <div className="flex gap-stack-md">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="https://github.com/bkoimett" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="https://linkedin.com/in/benjaminkoimett" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="https://dev.to/bwanachairman" target="_blank" rel="noopener noreferrer">Dev.to</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
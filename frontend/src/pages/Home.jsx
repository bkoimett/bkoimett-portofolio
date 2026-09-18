const Home = () => {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-24 relative">
        <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
          {/* Name badge — single characteristic identifier */}
          <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-4 py-3 mb-12">
            <span className="material-symbols-outlined text-accent text-sm">terminal</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Full-Stack Engineer</span>
          </div>

          {/* Headline — large-scale type treatment as visual element */}
          <h1 className="font-display-xl-mobile md:font-display-xl text-on-surface mb-8">
            Benjamin Kiprotich Koimett
          </h1>

          {/* Subhead — deliberate, no unnecessary labels */}
          <p className="font-headline-md text-on-surface-variant max-w-2xl mx-auto mb-8">
            I ship production applications across healthcare, agriculture, land governance, and Web3 —
            owning projects end-to-end from design through deployment. Based in Kenya, remote-ready,
            and building with AI tools daily.
          </p>

          {/* CTA buttons — one orchestrated moment: primary action first */}
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a 
              href="/projects" 
              className="bg-accent text-on-accent px-10 py-4 rounded-lg font-headline-md hover:opacity-110 active:scale-95 transition-all duration-200"
            >
              View My Work
            </a>
            <a 
              href="mailto:koimettb@gmail.com" 
              className="border border-muted text-on-surface px-10 py-4 rounded-lg font-headline-md hover:bg-surface/5 transition-all duration-200"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUALITY STATEMENT — replaces generic stats */}
      <section className="py-24 bg-surface/50">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline-lg text-on-surface mb-4">
                Quality Without Compromise
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                I build software that lasts. From mission-critical healthcare platforms to offline-first
                farming tools, I ship production applications that serve real users under real conditions.
              </p>
            </div>
            <div className="space-y-4">
              <div className="card p-6 text-center">
                <div className="font-display-lg text-accent mb-2">8+</div>
                <div className="font-label-md text-label-md text-muted uppercase mb-1">Projects Shipped</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-lg text-accent mb-2">4+</div>
                <div className="font-label-md text-label-md text-muted uppercase mb-1">Years Experience</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-lg text-accent mb-2">24/7</div>
                <div className="font-label-md text-label-md text-muted uppercase mb-1">Production Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TECHNICAL STACK — revised with cards, no glass */}
      <section className="py-24">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-on-surface mb-4">
              Core Infrastructure & Tooling
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              The stack that powers every project I own end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* React */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">code</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">React</h3>
              <p className="font-label-md text-on-surface-variant">Frontend Library</p>
            </div>

            {/* Node.js */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">dns</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">Node.js</h3>
              <p className="font-label-md text-on-surface-variant">Backend Runtime</p>
            </div>

            {/* MongoDB */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">database</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">MongoDB</h3>
              <p className="font-label-md text-on-surface-variant">Database</p>
            </div>

            {/* TypeScript */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">data_object</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">TypeScript</h3>
              <p className="font-label-md text-on-surface-variant">Type Safety</p>
            </div>

            {/* Docker */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">deployed_code</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">Docker</h3>
              <p className="font-label-md text-on-surface-variant">Containerization</p>
            </div>

            {/* Golang */}
            <div className="card p-6 text-center transition-colors duration-200 hover:bg-surface/80">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-accent">memory</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">Golang</h3>
              <p className="font-label-md text-on-surface-variant">Systems Language</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA — clean, no gradient noise */}
      <section className="py-24">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="font-display-xl-mobile md:font-display-xl text-on-surface mb-8">
            Let's Build Something Great
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
            Currently open to freelance opportunities and interesting collaborations. Let's discuss
            your next project.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a 
              href="/about" 
              className="bg-accent text-on-accent px-12 py-5 rounded-xl font-headline-md hover:opacity-110 active:scale-95 transition-all duration-200"
            >
              Start a Conversation
            </a>
            <a 
              href="mailto:koimettb@gmail.com" 
              className="border border-muted text-on-surface px-12 py-5 rounded-xl font-headline-md hover:bg-surface/5 transition-all duration-200"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="py-12 bg-surface border-t border-border/20">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left side */}
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="font-headline-sm text-on-surface font-bold">
                Benjamin Koimett
              </span>
              <span className="font-label-md text-on-surface-variant">
                © 2026 All rights reserved.
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <a href="https://github.com/bkoimett" className="text-on-surface-variant hover:text-accent transition-colors font-label-md" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://linkedin.com/in/benjaminkoimett" className="text-on-surface-variant hover:text-accent transition-colors font-label-md" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://dev.to/bwanachairman" className="text-on-surface-variant hover:text-accent transition-colors font-label-md" target="_blank" rel="noopener noreferrer">
                Dev.to
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
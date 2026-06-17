import React from 'react';

const Home = () => {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-section-gap relative">
        <div className="absolute inset-0 emerald-glow pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-6 text-center relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 mb-stack-md">
            <span className="material-symbols-outlined text-primary text-sm">terminal</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Available for New Projects</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl text-on-surface mb-stack-md">
            Benjamin Kiprotich Koimett
          </h1>

          {/* Subheading */}
          <p className="font-headline-md text-headline-md text-on-surface-variant max-w-3xl mx-auto mb-stack-md">
            Full-Stack MERN Engineer | TypeScript | Golang
          </p>

          {/* Description */}
          <p className="font-body-lg text-body-lg text-on-surface-variant/80 max-w-2xl mx-auto mb-stack-lg">
            I build production-grade applications that solve real problems with clean, maintainable code.
            Specializing in the MERN stack with a focus on performance and user experience.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-stack-md">
            <a 
              href="/projects" 
              className="bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-headline-md hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              className="border border-outline-variant text-on-surface px-10 py-4 rounded-lg font-headline-md hover:bg-white/5 transition-all duration-200"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUICK STATS */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            {/* Stat Card 1 */}
            <div className="glass-card p-stack-lg rounded-xl text-center">
              <div className="font-display-lg text-display-lg text-primary mb-2">4</div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase">Projects Shipped</div>
            </div>

            {/* Stat Card 2 */}
            <div className="glass-card p-stack-lg rounded-xl text-center">
              <div className="font-display-lg text-display-lg text-primary mb-2">5+</div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase">Years Experience</div>
            </div>

            {/* Stat Card 3 */}
            <div className="glass-card p-stack-lg rounded-xl text-center">
              <div className="font-display-lg text-display-lg text-primary mb-2">50K+</div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase">Lines of Code</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TECHNICAL STACK */}
      <section className="py-section-gap bg-surface-container-low/50">
        <div className="max-w-container-max mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-md">
              Core Infrastructure & Tooling
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-stack-md">
            {/* React */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">code</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">React</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Frontend Library</p>
            </div>

            {/* Node.js */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">dns</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Node.js</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Backend Runtime</p>
            </div>

            {/* MongoDB */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">database</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">MongoDB</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Database</p>
            </div>

            {/* TypeScript */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">data_object</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">TypeScript</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Type Safety</p>
            </div>

            {/* Docker */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">deployed_code</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Docker</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Containerization</p>
            </div>

            {/* Golang */}
            <div className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                <span className="material-symbols-outlined text-primary">memory</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Golang</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Systems Language</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LATEST WORK (Bento Grid) - SKIP FOR NOW */}
      {/* TODO: Add Bento Grid Projects Section */}

      {/* SECTION 5: FINAL CTA */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-6">
          <div className="glass-card rounded-2xl p-stack-lg md:p-24 text-center relative">
            <div className="absolute inset-0 emerald-glow opacity-30 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="font-display-lg text-display-xl-mobile md:text-display-lg text-on-surface mb-stack-md">
                Let's Build Something Great
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg">
                Currently open to freelance opportunities and interesting collaborations.
                Let's discuss your next project.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-stack-md">
                <a 
                  href="#contact" 
                  className="bg-primary-container text-on-primary-container px-12 py-5 rounded-xl font-headline-md hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Start a Conversation
                </a>
                <a 
                  href="/resume.pdf" 
                  className="border border-outline-variant text-on-surface px-12 py-5 rounded-xl font-headline-md hover:bg-white/5 transition-all duration-200"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="py-stack-lg bg-surface-dim border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-stack-md">
            {/* Left side */}
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Benjamin Koimett
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                © 2024 All rights reserved.
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <a href="https://github.com" className="text-on-surface-variant hover:text-primary transition-colors font-label-md">
                Github
              </a>
              <a href="https://linkedin.com" className="text-on-surface-variant hover:text-primary transition-colors font-label-md">
                LinkedIn
              </a>
              <a href="https://twitter.com" className="text-on-surface-variant hover:text-primary transition-colors font-label-md">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;

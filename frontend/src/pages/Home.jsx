import React from 'react';
import { stats } from '../data/stats';
import { techStack } from '../data/techStack';
import { terminalResponse } from '../lib/telemetry';

const Home = () => {
  const helpResponse = terminalResponse('$help');

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-section-gap relative">
        <div className="absolute inset-0 emerald-glow pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-6 text-center relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 mb-stack-md">
            <span className="material-symbols-outlined text-primary text-sm">terminal</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Available Immediately · Remote-Ready</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl text-on-surface mb-stack-md">
            Benjamin Kiprotich Koimett
          </h1>

          {/* Subheading */}
          <p className="font-headline-md text-headline-md text-on-surface-variant max-w-3xl mx-auto mb-stack-md">
            Full-Stack Software Engineer | MERN + Go + TypeScript
          </p>

          {/* Description */}
          <p className="font-body-lg text-body-lg text-on-surface-variant/80 max-w-2xl mx-auto mb-stack-lg">
            I ship production applications across healthcare, agriculture, land governance, and Web3 —
            owning projects end-to-end from design through deployment. Based in Kenya, remote-ready,
            and building with AI tools daily.
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
              href="mailto:koimettb@gmail.com"
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
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-stack-lg rounded-xl text-center"
              >
                <div className="font-display-lg text-display-lg text-primary mb-2">{stat.value}</div>
                <div className="font-label-md text-label-md text-on-surface-variant uppercase">{stat.label}</div>
              </div>
            ))}
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
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="glass-card p-stack-md rounded-xl text-center transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-stack-md">
                  <span className="material-symbols-outlined text-primary">{tech.name === 'Go' ? 'deployed_code' : tech.name === 'React' ? 'code' : tech.name === 'Node.js' ? 'dns' : tech.name === 'TypeScript' ? 'data_object' : tech.name === 'MongoDB' ? 'database' : 'memory'}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{tech.name}</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">{tech.category}</p>
              </div>
            ))}
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
                  href="/about"
                  className="bg-primary-container text-on-primary-container px-12 py-5 rounded-xl font-headline-md hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Start a Conversation
                </a>
                <a
                  href="mailto:koimettb@gmail.com"
                  className="border border-outline-variant text-on-surface px-12 py-5 rounded-xl font-headline-md hover:bg-white/5 transition-all duration-200"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TERMINAL */}
      <section className="py-section-gap bg-surface-container-low/50">
        <div className="max-w-container-max mx-auto px-6">
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="mb-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Interactive Terminal</h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {helpResponse || 'Available commands: $help $projects $stack $uptime $contact'}
              </p>
            </div>
            <div className="terminal-output mt-stack-lg">
              {terminalResponse('$projects')}
              {terminalResponse('$stack')}
              {terminalResponse('$uptime')}
              {terminalResponse('$contact')}
            </div>
          </div>
        </div>
      </section>

      </>
  );
};

export default Home;
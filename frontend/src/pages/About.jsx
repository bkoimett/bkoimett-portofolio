import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SITE_URL, personJsonLd } from '../utils/seo';
import { cvDownloadUrl, fetchActiveCv } from '../utils/cv';
import { techStack } from '../data/techStack';
import { profile } from '../data/profile';

const roles = [
  {
    role: 'Software Engineer',
    org: 'Zone01 Kisumu',
    period: 'Jan 2026 — Present',
    current: true,
    notes: [
      'Shipping full-stack applications with React, Vite, and Golang in a peer-driven 42 Network environment.',
      'Leading technical decisions and code reviews across a cohort of 10+ engineers.',
      'Mentoring engineers on deployment pipelines, AI-assisted development workflows, and Docker containerization.',
    ],
  },
  {
    role: 'Junior Frontend Developer',
    org: 'Occulus Technologies Ltd',
    period: 'May 2025 — Dec 2025',
    current: false,
    notes: [
      'Built reusable React components and responsive layouts using Tailwind CSS across 5 client projects.',
      'Integrated REST APIs and managed asynchronous data flows for 1,000+ daily active users.',
      'Resolved 50+ issues, improving page load performance by 28% through code splitting and lazy loading.',
    ],
  },
  {
    role: 'Manager',
    org: 'The Serenity Place Treatment Centre',
    period: 'Jan 2022 — Apr 2025',
    current: false,
    notes: [
      'Led operations for a rehabilitation facility, managing 30+ staff and 50+ residents.',
      'Implemented digital record-keeping systems, reducing documentation errors by 60%.',
    ],
  },
];

const About = () => {
  const [cv, setCv] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchActiveCv({ signal: controller.signal }).then((activeCv) => {
      if (!controller.signal.aborted) {
        setCv(activeCv);
        setCvLoading(false);
      }
    });
    return () => controller.abort();
  }, []);

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      ...personJsonLd,
      description: 'Personnel record — Benjamin K. Koimett, full-stack engineer (React, Node.js, MERN), employment ledger and technical index.',
    },
    url: `${SITE_URL}/about`,
  };

  return (
    <>
      <SEO
        title="Personnel record — Employment ledger & Technical index"
        description="Personnel record of Benjamin K. Koimett — full-stack React/Node.js engineer in Kisumu, Kenya. Employment ledger (Zone01, Occulus, Serenity Place) and technical index (MERN, Golang, Solana). Available remote."
        canonical="/about"
        keywords="Benjamin Koimett about, employment ledger, MERN stack, Zone01 Kisumu, Kenya full-stack engineer"
        jsonLd={aboutJsonLd}
      />
      {/* Record header */}
      <section className="container-page pt-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="file-index-sm">BK / ATTACHMENT 01 — PERSONNEL RECORD</p>
            <h1 className="mt-1 text-heading-xl font-semibold text-ink">
              The record of Benjamin K. Koimett
            </h1>
            <p className="mt-5 max-w-[58ch] text-body text-ink">
              Full-stack engineer shipping production applications across
              frontend, backend, and DevOps. I own projects end-to-end — from
              design through deployment — for live products serving real users
              in healthcare, agriculture, land governance, and Web3.
            </p>
            <p className="mt-4 max-w-[58ch] text-body text-ink-muted">
              I use Go for its concurrency primitives and performance, and the
              MERN stack to deliver dynamic, responsive web applications. I
              build with AI tools daily and thrive in fast-moving environments
              with real responsibility.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="border border-rule bg-paper-strong">
              <img
                src="https://res.cloudinary.com/deci4v6zv/image/upload/v1789670149/bkoimett1_asizun.png"
                alt="Portrait of Benjamin K. Koimett"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="flex items-center justify-between border-t border-rule px-3 py-2">
                <span className="file-index-sm">PORTRAIT · {profile.location}</span>
                <span className="file-index-sm">BK-026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employment ledger */}
      <section className="container-page mt-20">
        <header>
          <p className="file-index-sm">BK / EMPL.</p>
          <h2 className="mt-1 text-heading-xl font-semibold text-ink">
            Employment ledger
          </h2>
          <p className="mt-3 max-w-[58ch] text-body text-ink-muted">
            A chronological record of paid work. The current entry is marked.
          </p>
        </header>

        <div className="mt-8">
          {roles.map((item) => (
            <div
              key={item.role}
              className={`grid grid-cols-1 gap-x-8 border-b border-rule py-7 md:grid-cols-12 ${
                item.current ? 'border-l-2 border-l-registry pl-5 md:pl-6' : ''
              }`}
            >
              <p className="file-index-sm md:col-span-3 md:pt-1.5">
                {item.period}
                {item.current && (
                  <span className="ml-3 inline-block border border-registry px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-registry">
                    Current
                  </span>
                )}
              </p>
              <div className="md:col-span-9">
                <h3 className="text-title font-semibold text-ink">
                  {item.role}
                </h3>
                <p className="mt-0.5 text-[15px] text-registry">{item.org}</p>
                <ul className="mt-3 space-y-2">
                  {item.notes.map((note) => (
                    <li
                      key={note}
                      className="flex gap-3 text-[15px] leading-relaxed text-ink-muted"
                    >
                      <span aria-hidden="true" className="font-mono text-ink-muted">
                        —
                      </span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical index */}
      <section className="container-page mt-20">
        <header>
          <p className="file-index-sm">BK / TECH.</p>
          <h2 className="mt-1 text-heading-xl font-semibold text-ink">
            Technical index
          </h2>
        </header>

        <div className="mt-8">
          <div className="hidden border-b border-rule pb-2 sm:grid sm:grid-cols-12 sm:gap-x-8">
            <span className="file-index-sm col-span-5">Tool</span>
            <span className="file-index-sm col-span-4">Division</span>
            <span className="file-index-sm col-span-3">Level</span>
          </div>
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="grid grid-cols-1 gap-y-1 border-b border-rule py-3.5 sm:grid-cols-12 sm:gap-x-8"
            >
              <span className="text-[17px] font-semibold text-ink sm:col-span-5">
                {tech.name}
              </span>
              <span className="font-mono text-[13px] text-ink-muted sm:col-span-4">
                {tech.category}
              </span>
              <span className="file-index-sm sm:col-span-3">
                {tech.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Attestation */}
      <section className="container-page mt-20 pb-24">
        <div className="card-flat rounded-[2px] px-6 py-10 md:px-12 md:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[52ch]">
              <p className="file-index-sm">BK / ATTESTATION</p>
              <h2 className="mt-1 text-heading font-semibold text-ink">
                Open to the next file
              </h2>
              <p className="mt-3 text-body text-ink-muted">
                Available for freelance work and full-time roles. Start by
                reviewing the project records, then get in touch.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <span className="stamp">Available · Remote</span>
              {cvLoading ? (
                <button type="button" disabled className="btn btn-ghost" aria-busy="true">
                  Waking CV…
                </button>
              ) : cv && (
                <a href={cvDownloadUrl} className="btn btn-stroke">
                  Download CV
                </a>
              )}
              <Link to="/projects" className="btn btn-primary">
                Review the records
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
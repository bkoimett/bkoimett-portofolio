import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL, personJsonLd } from '../utils/seo';
import { cvDownloadUrl, fetchActiveCv, copyCvLink } from '../utils/cv';
import ProjectCard from '../components/primitives/ProjectCard';
import StatNumber from '../components/primitives/StatNumber';
import SystemMap from '../components/primitives/SystemMap';
import { stats } from '../data/stats';
import { techStack } from '../data/techStack';
import { profile } from '../data/profile';

const fallbackProjects = [
  {
    _id: '1',
    slug: 'carefacility-platform',
    title: 'CareFacility Platform',
    description: 'Full-stack healthcare management system serving The Serenity Place rehabilitation center.',
    category: 'Web Dev',
    technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
    github: 'https://github.com/bkoimett/carefacility',
    demo: 'https://theserenityplace.vercel.app',
  },
  {
    _id: '2',
    slug: 'landledger',
    title: 'LandLedger — blockchain title deed verification',
    description: 'Immutable title deed verification platform preventing land fraud across East Africa.',
    category: 'Blockchain',
    technologies: ['TypeScript', 'Golang', 'Solana', 'Smart Contracts'],
    github: 'https://github.com/bkoimett/land-ledge',
  },
];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cv, setCv] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    await copyCvLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects', {
          signal: controller.signal,
        });
        setProjects(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setProjects(fallbackProjects);
        }
      } finally {
        if (!controller.signal.aborted) setLoaded(true);
      }
    };
    fetchProjects();
    return () => controller.abort();
  }, []);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
          { '@type': 'ListItem', position: 3, name: 'Blog', item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <>
      <SEO
        title="Full-Stack Engineer — React, Node.js, MERN"
        description="Benjamin K. Koimett — full-stack software engineer (React, Node.js, MongoDB, Express) in Kisumu, Kenya. Shipping MERN production systems for healthcare, agriculture and land governance. Remote-ready — browse project records, blog case notes and CV."
        canonical="/"
        keywords="Benjamin Koimett, full-stack engineer, React developer, Node.js, MERN, MongoDB Express, Kisumu Kenya remote, healthcare platform"
        jsonLd={homeJsonLd}
      />
      {/* Masthead */}
      <section className="container-page pt-14">
        <div>
          <p className="file-index animate-rise">
            REG. NO. BK-026 · FILED {profile.location} · EST. 2022
          </p>

          <div className="relative mt-8">
            <h1 className="max-w-[14ch] text-masthead font-semibold text-ink animate-rise">
              Benjamin K. Koimett
            </h1>
            <span
              aria-hidden="true"
              className="stamp absolute -top-2 right-0 hidden sm:inline-block animate-rise animate-rise-delay"
            >
              Available · Remote
            </span>
          </div>

          <p
            className="mt-6 max-w-[62ch] text-heading font-medium text-ink animate-rise animate-rise-delay"
          >
            Full-stack software engineer shipping production systems in
            healthcare, agriculture, land governance, and Web3.
          </p>

          <p className="mt-4 max-w-[62ch] text-body text-ink-muted animate-rise animate-rise-delay">
            I take projects from first commit to live deployment — building the
            frontend, the backend, and the infrastructure between them. Based
            in Kisumu, Kenya. Remote-ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 animate-rise animate-rise-delay">
            <Link to="/projects" className="btn btn-primary">
              Project records
            </Link>
            <a href={`mailto:${profile.email}`} className="btn btn-stroke">
              Contact
            </a>
            {cvLoading ? (
              <button type="button" disabled className="btn btn-ghost" aria-busy="true">
                Waking CV…
              </button>
            ) : cv && (
              <a href={cvDownloadUrl} className="btn btn-stroke">
                Download CV
              </a>
            )}
            {cv && (
              <button
                type="button"
                onClick={handleShare}
                aria-live="polite"
                className="btn btn-ghost"
              >
                {copied ? 'Link copied' : 'Share CV'}
              </button>
            )}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Record cells */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`ledger-row lg:pl-6 ${i === 0 ? 'lg:pl-0' : ''}`}
            >
              <p className="font-mono text-[2rem] font-medium leading-none text-ink">
                <StatNumber {...stat} />
              </p>
              <p className="file-index-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System map */}
      <section className="container-page mt-24">
        <header>
          <p className="file-index-sm">BK / NETWORK — PLAT OF FILED SYSTEMS</p>
          <h2 className="mt-1 text-heading-xl font-semibold text-ink">
            System map
          </h2>
          <p className="mt-3 max-w-[60ch] text-body text-ink-muted">
            A survey of the production plots. Each parcel opens its case file.
          </p>
        </header>

        <div className="mt-8">
          {loaded ? (
            <SystemMap projects={projects} />
          ) : (
            <p className="file-index-sm py-6">Plotting records…</p>
          )}
        </div>
      </section>

      {/* Production records */}
      <section className="container-page mt-24">
        <header>
          <p className="file-index-sm">BK / PROD. — RECENTLY FILED</p>
          <h2 className="mt-1 text-heading-xl font-semibold text-ink">
            Production records
          </h2>
          <p className="mt-3 max-w-[60ch] text-body text-ink-muted">
            A selection of systems shipped for real users. The full index is on
            the project records page.
          </p>
        </header>

        <div className="mt-8">
          {loaded ? (
            projects.slice(0, 4).map((project, i) => (
              <ProjectCard
                key={project._id}
                project={project}
                regNo={`BK-${String(i + 1).padStart(3, '0')}`}
              />
            ))
          ) : (
            <p className="file-index-sm py-6">Loading records…</p>
          )}
        </div>

        <Link to="/projects" className="btn btn-stroke mt-6">
          View the full index
        </Link>
      </section>

      {/* Technical index */}
      <section className="container-page mt-24">
        <header>
          <p className="file-index-sm">BK / TECH.</p>
          <h2 className="mt-1 text-heading-xl font-semibold text-ink">
            Technical index
          </h2>
        </header>

        <div className="mt-8">
          <div className="hidden border-b border-rule pb-2 sm:grid sm:grid-cols-12 sm:gap-x-8">
            <span className="file-index-sm col-span-4">Tool</span>
            <span className="file-index-sm col-span-4">Division</span>
            <span className="file-index-sm col-span-4">Level</span>
          </div>
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="grid grid-cols-1 gap-y-1 border-b border-rule py-3.5 sm:grid-cols-12 sm:gap-x-8"
            >
              <span className="text-[17px] font-semibold text-ink sm:col-span-4">
                {tech.name}
              </span>
              <span className="text-[15px] text-ink-muted sm:col-span-4">
                {tech.category}
              </span>
              <span className="file-index-sm sm:col-span-4">
                {tech.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact file */}
      <section className="container-page mt-24 pb-24">
        <div className="card-flat rounded-[2px] px-6 py-10 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="file-index-sm">BK / CONTACT</p>
              <h2 className="mt-1 text-heading-xl font-semibold text-ink">
                Open a file
              </h2>
              <p className="mt-3 max-w-[58ch] text-body text-ink-muted">
                Currently available for freelance work and full-time roles.
                Send a note and I will get back to you within a day.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 md:col-span-5">
              <a
                href={`mailto:${profile.email}`}
                className="btn btn-primary w-full justify-between"
              >
                <span>{profile.email}</span>
                <span aria-hidden="true">→</span>
              </a>
              <div className="flex gap-5 text-[15px]">
                <a
                  className="filigree"
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="filigree"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                {profile.devto && (
                  <a
                    className="filigree"
                    href={profile.devto}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dev.to
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
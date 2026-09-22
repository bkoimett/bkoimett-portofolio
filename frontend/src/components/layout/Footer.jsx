import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';

const Footer = () => {
  return (
    <footer className="border-t border-rule bg-paper-strong">
      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold text-ink">
              {profile.name}
            </p>
            <p className="file-index-sm mt-1">
              Full-stack software engineer · Filed in {profile.location}
            </p>
          </div>

          <div>
            <p className="file-index-sm uppercase tracking-[0.12em] text-ink-muted">
              Record index
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <Link className="text-[15px] text-ink-muted hover:text-registry" to="/">
                Home
              </Link>
              <Link className="text-[15px] text-ink-muted hover:text-registry" to="/projects">
                Project records
              </Link>
              <Link className="text-[15px] text-ink-muted hover:text-registry" to="/about">
                Employment ledger
              </Link>
            </div>
          </div>

          <div>
            <p className="file-index-sm uppercase tracking-[0.12em] text-ink-muted">
              Correspondence
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <a
                className="text-[15px] text-ink-muted hover:text-registry"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
              <a
                className="text-[15px] text-ink-muted hover:text-registry"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-[15px] text-ink-muted hover:text-registry"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              {profile.devto && (
                <a
                  className="text-[15px] text-ink-muted hover:text-registry"
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

        <div className="mt-8 flex flex-col gap-2 border-t border-rule pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Reg. {profile.email} · EST. 2022
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <Link
            to="/admin/login"
            className="text-ink-muted hover:text-registry transition-colors"
            aria-label="Admin console"
            title="Admin console"
          >
            🔒
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
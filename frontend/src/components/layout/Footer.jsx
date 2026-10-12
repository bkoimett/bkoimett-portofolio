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
              <Link className="text-[15px] text-ink-muted hover:text-registry" to="/blog">
                Filed notes
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

        <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Reg. {profile.email} · EST. 2022
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cookie-consent'))}
              className="inline-flex items-center border border-rule/0 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/45 hover:border-rule-strong hover:text-ink transition-colors"
            >
              Cookie preferences
            </button>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 border border-rule/0 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/45 hover:border-rule-strong hover:text-ink transition-colors"
              aria-label="Admin console"
              title="Admin console"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="10" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="16" r="1.25" />
              </svg>
              Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
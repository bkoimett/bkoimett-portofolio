import React from 'react';
import { Link } from 'react-router-dom';

const StatusToken = ({ project }) => {
  let label = 'File only';
  let cls = 'border-rule-strong text-ink-muted';
  if (project.demo) {
    label = 'Live';
    cls = 'border-registry bg-registry text-on-registry';
  } else if (project.github) {
    label = 'Source';
    cls = 'border-registry text-registry';
  }
  return (
    <span
      className={`inline-block border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${cls}`}
    >
      {label}
    </span>
  );
};

const SurveyLines = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <line x1="0" y1="0" x2="100" y2="100" stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <line x1="100" y1="0" x2="0" y2="100" stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <line x1="50" y1="0" x2="50" y2="100" stroke="var(--rule-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <line x1="0" y1="50" x2="100" y2="50" stroke="var(--rule-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
  </svg>
);

const SystemMap = ({ projects }) => {
  const plots = projects.slice(0, 4);

  return (
    <figure className="border border-rule">
      <div className="relative overflow-hidden">
        <SurveyLines />
        <div className="relative grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
          {plots.map((project, i) => (
            <Link
              key={project._id}
              to={`/projects/${project.slug}`}
              className="group flex flex-col border border-rule bg-paper-strong p-4 transition-colors hover:border-registry sm:p-5"
            >
              <p className="file-index-sm">PLOT BK-0{i + 1}</p>
              <h3 className="mt-2 text-title-sm font-semibold leading-snug text-ink transition-colors group-hover:text-registry">
                {project.title}
              </h3>
              {project.category && (
                <p className="mt-1 font-mono text-[12px] text-ink-muted">
                  {project.category}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <StatusToken project={project} />
                <span className="text-[13px] font-medium text-ink-muted underline-offset-[3px] transition-colors group-hover:text-registry group-hover:underline">
                  Open file
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <figcaption className="border-t border-rule px-4 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <span className="file-index-sm">
            SURVEY BK-026 · {plots.length} PLOTS FILED · SCALE 1:1,000,000
          </span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-registry" />
              live
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 border border-registry" />
              source
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 border border-rule-strong" />
              file only
            </span>
          </span>
        </div>
      </figcaption>
    </figure>
  );
};

export default SystemMap;
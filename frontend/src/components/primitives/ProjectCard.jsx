import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, regNo, className = '', showImage = true }) => {
  const number = regNo || '––';

  return (
    <article className={`ledger-row group ${className}`}>
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-12">
        <div className="md:col-span-2 md:mt-1.5">
          <span className="file-index-sm">{number}</span>
        </div>

        <div
          className={
            showImage
              ? 'order-last mt-4 md:order-none md:col-span-8'
              : 'md:col-span-10'
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-title-sm text-ink font-semibold">
              <Link
                to={`/projects/${project.slug}`}
                className="group-hover:text-registry transition-colors"
              >
                {project.title}
              </Link>
            </h3>
            <span className="file-index-sm uppercase tracking-[0.08em]">
              {project.category}
            </span>
          </div>

          <p className="mt-1.5 max-w-[68ch] text-body-sm text-ink-muted">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[13px] text-ink-muted">
              {project.technologies?.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <span aria-hidden="true" className="hidden text-rule-strong md:inline">
              │
            </span>
            <div className="flex items-center gap-4">
              {project.github && (
                <a
                  className="filigree text-[14px] font-medium"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
              )}
              {project.demo && (
                <a
                  className="filigree text-[14px] font-medium"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live
                </a>
              )}
              <Link
                className="filigree text-[14px] font-medium"
                to={`/projects/${project.slug}`}
              >
                Record
              </Link>
            </div>
          </div>
        </div>

        {showImage && project.image && (
          <div className="mt-4 md:col-span-2 md:mt-0">
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full border border-rule object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
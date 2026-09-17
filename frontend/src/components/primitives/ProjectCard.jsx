import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <article key={project._id} className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video">
        <img alt={project.title} className="w-full h-full object-cover" src={project.image} />
        <span className="absolute top-4 left-4 tech-pill px-3 py-1 rounded-full font-label-md text-[12px] uppercase">{project.category}</span>
      </div>
      <div className="p-stack-lg flex flex-col flex-grow">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">{project.title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-stack-lg mt-auto">
          {project.technologies.map((tech) => (
            <span key={tech} className="font-code-sm text-code-sm tech-pill px-3 py-1 rounded">{tech}</span>
          ))}
        </div>
        <div className="flex gap-stack-md border-t border-white/5 pt-stack-md">
          {project.github && (
            <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.github} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-[20px]">code</span>GitHub
            </a>
          )}
          {project.demo && (
            <a className="flex items-center gap-2 font-label-md text-primary hover:underline" href={project.demo} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-[20px]">open_in_new</span>Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
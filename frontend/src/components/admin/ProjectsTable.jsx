import React from 'react';

const ProjectsTable = ({ projects, onDelete }) => {
  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-container-high border-b border-outline-variant">
          <tr>
            <th className="px-4 py-3 font-label-md text-label-md text-on-surface">Title</th>
            <th className="px-4 py-3 font-label-md text-label-md text-on-surface">Category</th>
            <th className="px-4 py-3 font-label-md text-label-md text-on-surface">Tech Stack</th>
            <th className="px-4 py-3 font-label-md text-label-md text-on-surface">Status</th>
            <th className="px-4 py-3 font-label-md text-label-md text-on-surface text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {projects.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-5 text-center text-on-surface-variant">
                No projects yet. Create your first one!
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container-highest overflow-hidden">
                      {project.image && (
                        <img
                          className="w-full h-full object-cover"
                          src={project.image}
                          alt={project.title}
                        />
                      )}
                    </div>
                    <span className="font-body-md text-body-md font-semibold">
                      {project.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    {project.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-primary/10 text-primary font-label-md text-[10px] rounded border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${project.status === 'published' ? 'bg-primary' : 'bg-tertiary'}`}>
                    </span>
                    <span className="font-label-md text-xs capitalize">
                      {project.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-on-surface-variant hover:text-primary transition-colors rounded">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                    <button
                      onClick={onDelete}
                      className="p-1 text-on-surface-variant hover:text-error transition-colors rounded"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
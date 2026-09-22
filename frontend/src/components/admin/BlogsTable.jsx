import React from 'react';

const BlogsTable = ({
  blogs,
  onEdit,
  onDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-rule-strong text-left">
            <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Reg.
            </th>
            <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Title
            </th>
            <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Tags
            </th>
            <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Status
            </th>
            <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted text-right">
              Views
            </th>
            <th className="pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-6 font-mono text-[13px] text-ink-muted"
              >
                No blog records on file. File the first blog record to begin.
              </td>
            </tr>
          ) : (
            blogs.map((blog, i) => {
              const confirming = confirmDeleteId === blog._id;
              return (
                <tr
                  key={blog._id}
                  className="border-b border-rule text-[14px] hover:bg-paper-strong/60"
                >
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink-muted">
                    BK-BLG-{String(i + 1).padStart(3, '0')}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-ink">{blog.title}</p>
                    <p className="font-mono text-[12px] text-ink-muted">
                      {blog.slug}
                    </p>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink-muted">
                    {blog.tags?.length ? blog.tags.join(', ') : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        blog.status === 'published'
                          ? 'border-registry text-registry'
                          : 'border-rule-strong text-ink-muted'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-[12px] text-ink">
                    {blog.views ?? 0}
                  </td>
                  <td className="py-3 text-right">
                    {confirming ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="font-mono text-[12px] text-stamp">
                          Delete?
                        </span>
                        <button
                          type="button"
                          onClick={() => onDelete(blog._id)}
                          className="border border-stamp px-2 py-0.5 font-mono text-[12px] text-stamp hover:bg-stamp hover:text-paper"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="border border-rule-strong px-2 py-0.5 font-mono text-[12px] text-ink-muted hover:text-ink"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit(blog)}
                          className="filigree text-[14px] font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(blog._id)}
                          className="text-[14px] font-medium text-ink-muted hover:text-stamp"
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BlogsTable;
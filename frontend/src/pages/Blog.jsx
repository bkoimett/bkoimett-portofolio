import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const fallbackBlogs = [
  {
    _id: '1',
    slug: 'building-a-portfolio-registry-my-journey-with-open-source-tools',
    title: 'Building a Portfolio Registry: My Journey with Open-Source Tools',
    description:
      'How I structured my public work as a searchable registry of projects, decisions, and lessons learned — from early scripts to the filed system you see today.',
    content: `# Building a Portfolio Registry`,
    publishDate: '2026-09-21',
    tags: ['portfolio', 'systems', 'open source', 'registry'],
    readTime: '8 min read',
    views: 142,
  },
  {
    _id: '2',
    slug: 'from-registry-records-to-modern-apis-lessons-learned',
    title: 'From Registry Records to Modern APIs: Lessons Learned',
    description:
      'What a land registry, a patient record system, and a farm ledger taught me about designing APIs that survive scale and succession.',
    content: `# From Registry Records to Modern APIs`,
    publishDate: '2026-09-21',
    tags: ['api', 'design', 'lessons', 'registry', 'backend'],
    readTime: '6 min read',
    views: 89,
  },
];

const formatDate = (d) => {
  if (!d) return '—';
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs', { signal: controller.signal });
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setBlogs(fallbackBlogs);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, []);

  const displayedBlogs = blogs.length ? blogs : fallbackBlogs;

  const allTags = useMemo(() => {
    const s = new Set();
    displayedBlogs.forEach((b) => (b.tags || []).forEach((t) => s.add(t)));
    return ['all', ...Array.from(s).slice(0, 8)];
  }, [displayedBlogs]);

  const filtered = activeTag === 'all' ? displayedBlogs : displayedBlogs.filter((b) => (b.tags || []).includes(activeTag));

  return (
    <div className="container-page pt-14 pb-24">
      <header className="border-b border-rule pb-10">
        <p className="file-index-sm">BK / BLOG — FILED ARTICLES</p>
        <h1 className="mt-1 text-heading-xl font-semibold text-ink">Filed notes</h1>
        <p className="mt-3 max-w-[62ch] text-body text-ink-muted">
          Case notes on building registry-line systems — APIs, offline ledgers, and the trade-offs
          between paper forms and live code. Each entry is a filed record, not a feed.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className={`border px-4 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] rounded-[2px] transition-colors ${
              activeTag === tag
                ? 'border-registry bg-registry text-on-registry'
                : 'border-rule-strong text-ink-muted hover:border-registry hover:text-registry'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-3 border-b border-rule py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          {filtered.length} {filtered.length === 1 ? 'record' : 'records'} on file
        </span>
        <span className="h-3 w-px bg-rule-strong" aria-hidden="true" />
        <span className="font-mono text-[11px] text-ink-muted">{activeTag === 'all' ? 'All divisions' : `Tag: ${activeTag}`}</span>
      </div>

      {loading ? (
        <p className="file-index-sm py-10">Opening the index…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-rule-strong bg-paper-strong/40 px-6 py-12">
          <p className="file-index-sm">No records match this tag.</p>
          <button type="button" onClick={() => setActiveTag('all')} className="btn btn-stroke mt-4">
            Clear filter
          </button>
        </div>
      ) : (
        <div className="mt-0">
          {filtered.map((blog, i) => (
            <article
              key={blog._id}
              className="grid grid-cols-1 gap-x-8 border-b border-rule py-8 md:grid-cols-[112px_1fr]"
            >
              <div className="hidden md:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">BK-BLG-{String(i + 1).padStart(3, '0')}</p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">{formatDate(blog.publishDate)}</p>
                {blog.views != null && (
                  <p className="mt-2 inline-block border border-rule px-2 py-0.5 font-mono text-[11px] text-ink-muted">{blog.views} views</p>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 md:hidden">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">BK-BLG-{String(i + 1).padStart(3, '0')}</span>
                  <span className="text-rule-strong">·</span>
                  <span className="font-mono text-[11px] text-ink-muted">{formatDate(blog.publishDate)}</span>
                </div>

                <h2 className="mt-2 text-title font-semibold leading-tight text-ink md:mt-0">
                  <Link to={`/blog/${blog.slug}`} className="hover:text-registry transition-colors">
                    {blog.title}
                  </Link>
                </h2>

                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">{blog.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                  <span className="border border-rule px-2 py-0.5">{blog.readTime || '5 min read'}</span>
                  {blog.tags?.slice(0, 3).map((t) => (
                    <span key={t} className="border border-rule-strong/60 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                  {blog.tags?.length > 3 && <span className="px-1">+{blog.tags.length - 3}</span>}
                </div>

                <Link
                  to={`/blog/${blog.slug}`}
                  className="filigree mt-5 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em]"
                >
                  Open record <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-rule pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">More records are filed as work ships.</p>
        <Link to="/projects" className="filigree font-mono text-[12px] uppercase tracking-[0.08em]">
          Project index →
        </Link>
      </div>
    </div>
  );
};

export default Blog;

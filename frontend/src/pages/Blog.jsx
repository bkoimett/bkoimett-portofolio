import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import RecordFigure from '../components/primitives/RecordFigure';
import { SkeletonNoteIndex } from '../components/primitives/Skeleton';
import { fallbackBlogs } from '../data/fallbackRecords';

const formatDate = (d) => {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs', { signal: controller.signal });
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        setBlogs(fallbackBlogs);
        setOffline(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, []);

  const displayedBlogs = blogs.length ? blogs : fallbackBlogs;

  const allTags = useMemo(() => {
    const set = new Set();
    displayedBlogs.forEach((b) => (b.tags || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set).slice(0, 8)];
  }, [displayedBlogs]);

  const filtered =
    activeTag === 'all' ? displayedBlogs : displayedBlogs.filter((b) => (b.tags || []).includes(activeTag));

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Filed notes – Benjamin K. Koimett',
    description: 'Case notes on building registry-line systems by Benjamin K. Koimett.',
    url: `${SITE_URL}/blog`,
    author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett' },
    blogPost: filtered.map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.description,
      url: `${SITE_URL}/blog/${b.slug}`,
      datePublished: b.publishDate ? new Date(b.publishDate).toISOString() : undefined,
      author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett' },
    })),
  };

  return (
    <div className="container-page pt-14 pb-24">
      <SEO
        title="Filed notes – MERN APIs & Registry Case Notes"
        description="Filed notes by Benjamin K. Koimett on API design, offline-first systems and the trade-offs between paper forms and live code, written from production work in Kenya."
        canonical="/blog"
        keywords="Benjamin Koimett blog, React Node.js blog, MERN case notes, API design, offline-first, Kenya developer blog"
        jsonLd={blogJsonLd}
      />
      <header className="border-b border-rule pb-10">
        <p className="file-index-sm">BK / BLOG – Filed articles</p>
        <h1 className="mt-1 text-heading-xl font-semibold text-ink">Filed notes</h1>
        <p className="mt-3 max-w-[62ch] text-body text-ink-muted">
          What the work taught me, written down: API contracts, offline-first systems,
          and the decisions that turned out to be wrong. Each note is a record, not a feed.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-rule pb-4">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-[2px] border px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors ${
                activeTag === tag
                  ? 'border-registry bg-registry text-on-registry'
                  : 'border-rule-strong text-ink-muted hover:border-registry hover:text-registry'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          {loading
            ? 'Counting records…'
            : `${filtered.length} ${filtered.length === 1 ? 'record' : 'records'} on file`}
        </p>
      </div>

      {loading ? (
        <SkeletonNoteIndex rows={4} />
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-rule-strong px-6 py-12">
          <p className="text-body text-ink">No notes are filed under {activeTag}.</p>
          <p className="mt-1 text-body-sm text-ink-muted">
            Clear the tag to read the whole set of notes.
          </p>
          <button type="button" onClick={() => setActiveTag('all')} className="btn btn-stroke mt-5">
            Show all notes
          </button>
        </div>
      ) : (
        <>
          {offline && (
            <p className="file-index-sm border-b border-rule py-3">
              The registry is not reachable from this device. These are the notes held
              locally.
            </p>
          )}
          {filtered.map((blog, i) => (
            <article
              key={blog._id || blog.slug}
              className="group grid grid-cols-1 gap-x-8 border-b border-rule py-8 md:grid-cols-[112px_1fr_188px]"
            >
              <div className="hidden md:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  BK-BLG-{String(i + 1).padStart(3, '0')}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">{formatDate(blog.publishDate)}</p>
                {blog.views != null && (
                  <p className="mt-2 inline-block border border-rule px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                    {blog.views} reads
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:hidden">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                    BK-BLG-{String(i + 1).padStart(3, '0')}
                  </span>
                  <span className="text-rule-strong" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    {formatDate(blog.publishDate)}
                  </span>
                </div>

                <h2 className="mt-3 text-title font-semibold leading-tight text-ink md:mt-0">
                  <Link to={`/blog/${blog.slug}`} className="transition-colors group-hover:text-registry">
                    {blog.title}
                  </Link>
                </h2>

                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
                  {blog.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                  {blog.readTime && (
                    <span className="border border-rule px-2 py-0.5">{blog.readTime}</span>
                  )}
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

              <Link
                to={`/blog/${blog.slug}`}
                className="mt-5 block md:mt-0"
                aria-label={`${blog.title} – open record`}
              >
                <RecordFigure
                  project={{ ...blog, title: blog.title }}
                  compact
                  imageClassName="aspect-[4/3] w-full border border-rule object-cover"
                />
              </Link>
            </article>
          ))}
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-6">
        <p className="file-index-sm">Notes are filed as the work ships.</p>
        <Link to="/projects" className="filigree font-mono text-[12px] uppercase tracking-[0.08em]">
          Project records
        </Link>
      </div>
    </div>
  );
};

export default Blog;

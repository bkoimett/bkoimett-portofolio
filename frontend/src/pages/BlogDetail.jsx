import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import StatusBadge from '../components/primitives/StatusBadge';

const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewedRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/slug/${slug}`, { signal: controller.signal });
        setBlog(response.data);
        setError('');
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Record not found');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchBlog();
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (blog?._id && viewedRef.current !== blog._id) {
      viewedRef.current = blog._id;
      const controller = new AbortController();
      api.post(`/blogs/${blog._id}/view`, {}, { signal: controller.signal }).catch(() => {});
      return () => controller.abort();
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="container-page py-14">
        <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry">
          <span aria-hidden="true">←</span> Blog index
        </Link>
        <p className="file-index-sm mt-10">Opening the record…</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container-page py-14">
        <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry">
          <span aria-hidden="true">←</span> Blog index
        </Link>
        <div className="mt-10 max-w-[60ch] border border-rule bg-paper-strong px-6 py-10">
          <p className="file-index-sm">REF. NOT FOUND — 404</p>
          <h1 className="mt-2 text-heading font-semibold text-ink">Not on record</h1>
          <p className="mt-3 text-body text-ink-muted">This filing does not exist. It may have been moved, renamed, or never filed.</p>
          <Link to="/blog" className="btn btn-primary mt-6">
            Return to the index
          </Link>
        </div>
      </div>
    );
  }

  const filed = formatDate(blog.publishDate);

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett', url: SITE_URL },
    datePublished: blog.publishDate ? new Date(blog.publishDate).toISOString() : undefined,
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
    image: `${SITE_URL}/og-cover.png`,
    keywords: (blog.tags || []).join(', '),
    url: `${SITE_URL}/blog/${blog.slug}`,
  };

  return (
    <div className="container-page py-14">
      <SEO
        title={blog.title}
        description={blog.description || blog.content?.slice(0, 155)}
        canonical={`/blog/${blog.slug}`}
        type="article"
        keywords={(blog.tags || []).join(', ') + ', Benjamin Koimett, React Node.js'}
        jsonLd={blogPostingJsonLd}
      />
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry"
      >
        <span aria-hidden="true">←</span> Blog index
      </Link>

      <article className="mt-8 max-w-[72ch]">
        <header className="border-b border-rule pb-8">
          <div className="file-index-sm flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>BK / BLOG — FILED {filed ? filed.toUpperCase() : '—'}</span>
            {blog.views != null && <span>{blog.views} views</span>}
          </div>

          <h1 className="mt-3 text-heading-xl font-semibold text-ink">{blog.title}</h1>

          {blog.description && <p className="mt-3 text-body text-ink-muted">{blog.description}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {blog.readTime && <StatusBadge>{blog.readTime}</StatusBadge>}
            {blog.views != null && <StatusBadge>{blog.views} views</StatusBadge>}
            {blog.status && (
              <span
                className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${
                  blog.status === 'published' ? 'border-registry text-registry' : 'border-rule-strong text-ink-muted'
                }`}
              >
                {blog.status}
              </span>
            )}
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {blog.tags.map((t) => (
                <span key={t} className="border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="markdown-body mt-8">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        <div className="mt-10 border-t border-rule pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/blog" className="btn btn-stroke">
              ← Back to index
            </Link>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              <span>Ref. BK-BLG / {blog.slug}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rule-double" />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/projects" className="filigree font-mono text-[12px] uppercase tracking-[0.08em]">
            Project records →
          </Link>
          <span className="text-rule-strong">·</span>
          <Link to="/about" className="filigree font-mono text-[12px] uppercase tracking-[0.08em]">
            Personnel record →
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;

import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import StatusBadge from '../components/primitives/StatusBadge';
import ExpandableImage from '../components/primitives/ExpandableImage';

const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

function resolveImage(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith('/api/')) {
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '');
    if (base && base.startsWith('http')) return `${base}${src}`;
    return src;
  }
  return src;
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewedRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setBlog(null);
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/slug/${slug}`, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setBlog(response.data);
          setError('');
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError' && !controller.signal.aborted) {
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
        <div className="mx-auto max-w-[72ch]">
          <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry">
            <span aria-hidden="true">←</span> Blog index
          </Link>
          <p className="file-index-sm mt-10">Opening the record…</p>
          <div className="mt-6 h-8 w-2/3 animate-pulse bg-paper-strong" />
          <div className="mt-4 h-4 w-full animate-pulse bg-paper-strong" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-[72ch] text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry">
            <span aria-hidden="true">←</span> Blog index
          </Link>
          <div className="mt-10 border border-rule bg-paper-strong px-6 py-10">
            <p className="file-index-sm">REF. NOT FOUND – 404</p>
            <h1 className="mt-2 text-heading font-semibold text-ink">Not on record</h1>
            <p className="mt-3 text-body text-ink-muted">This filing does not exist. It may have been moved, renamed, or never filed.</p>
            <Link to="/blog" className="btn btn-primary mt-6">
              Return to the index
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filed = formatDate(blog.publishDate);
  const imgSrc = resolveImage(blog.image);

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    author: { '@type': 'Person', name: 'Benjamin Kiprotich Koimett', url: SITE_URL },
    datePublished: blog.publishDate ? new Date(blog.publishDate).toISOString() : undefined,
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
    image: imgSrc || `${SITE_URL}/og-cover.png`,
    keywords: (blog.tags || []).join(', '),
    url: `${SITE_URL}/blog/${blog.slug}`,
  };

  return (
    <div className="container-page py-14">
      <SEO
        title={blog.title}
        description={blog.description || blog.content?.slice(0, 155)}
        canonical={`/blog/${blog.slug}`}
        image={imgSrc || `${SITE_URL}/og-cover.png`}
        type="article"
        keywords={(blog.tags || []).join(', ') + ', Benjamin Koimett, React Node.js'}
        jsonLd={blogPostingJsonLd}
      />

      <div className="mx-auto max-w-[72ch]">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry"
        >
          <span aria-hidden="true">←</span> Blog index
        </Link>

        <article className="mt-8">
          {/* Symmetrical header – same rhythm as ProjectDetail */}
          <header className="border-y border-rule py-8">
            <div className="file-index-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center md:justify-start md:text-left">
              <span>BK / BLOG</span>
              <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
              <span>{blog.views != null ? `${blog.views} views` : 'FILE OPEN'}</span>
              {filed && (
                <>
                  <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
                  <span>FILED {filed.toUpperCase()}</span>
                </>
              )}
              {blog.readTime && (
                <>
                  <span className="hidden h-3 w-px bg-rule-strong md:block" aria-hidden="true" />
                  <span>{blog.readTime}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-center text-heading-xl font-semibold leading-tight text-ink md:text-left">{blog.title}</h1>
            {blog.description && (
              <p className="mx-auto mt-3 max-w-[62ch] text-center text-body text-ink-muted md:mx-0 md:text-left">{blog.description}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
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
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {blog.tags.map((t) => (
                  <span key={t} className="border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Symmetrical figure – same frame as ProjectDetail */}
          <figure className="mt-8 border border-rule bg-paper-strong p-2">
            {imgSrc ? (
              <ExpandableImage
                src={imgSrc}
                alt={blog.title}
                caption={`BK-BLG-${blog.slug}`}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center border border-dashed border-rule-strong bg-paper">
                <span className="file-index-sm text-center">No figure on file – add title image in console</span>
              </div>
            )}
            <figcaption className="flex items-center justify-between px-2 pt-2">
              <span className="file-index-sm">FIG. BK-BLG – {blog.slug}</span>
              <span className="file-index-sm">{blog.tags?.length ? `${blog.tags.length} tags` : '–'}</span>
            </figcaption>
          </figure>

          <div className="markdown-body mt-8">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* Symmetrical meta ledger – mirrors ProjectDetail "In the build" */}
          <div className="mt-10 border-y border-rule py-6">
            <h2 className="file-index-sm text-center uppercase tracking-[0.12em] md:text-left">Filed under</h2>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {(blog.tags || []).length ? (
                blog.tags.map((t) => (
                  <span key={t} className="border border-rule px-2.5 py-1 font-mono text-[13px] text-ink">
                    {t}
                  </span>
                ))
              ) : (
                <span className="file-index-sm">General</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/blog" className="btn btn-stroke">
              ← Back to index
            </Link>
            <span className="text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">Ref. BK-BLG / {blog.slug}</span>
          </div>

          <div className="mt-8 rule-double" />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted md:justify-between">
            <span>Ref. BK / BLOG – {blog.slug}</span>
            <div className="flex gap-4">
              <Link to="/projects" className="filigree">
                Project records →
              </Link>
              <span className="text-rule-strong">·</span>
              <Link to="/about" className="filigree">
                Personnel →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;

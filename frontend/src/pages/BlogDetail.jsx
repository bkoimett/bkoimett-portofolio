import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import { SITE_URL } from '../utils/seo';
import RecordFigure from '../components/primitives/RecordFigure';
import { resolveImage } from '../utils/images';
import RichText from '../components/primitives/RichText';
import { SkeletonSheet } from '../components/primitives/Skeleton';

const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'long', month: 'long', day: 'numeric' });
};

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
        if (controller.signal.aborted) return;
        setBlog(response.data);
      } catch (err) {
        if (controller.signal.aborted || err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError('No note answers to this reference.');
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
    return undefined;
  }, [blog]);

  if (loading) return <SkeletonSheet label="Opening the note" />;

  if (error || !blog) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-[62ch]">
          <p className="file-index-sm">Ref. 404 – not in the index</p>
          <h1 className="mt-2 text-heading-xl font-semibold text-ink">Not on record</h1>
          <p className="mt-3 text-body text-ink-muted">
            No note answers to this reference. It may have been renamed, or it may never
            have been filed.
          </p>
          <Link to="/blog" className="btn btn-primary mt-8">
            Open the note index
          </Link>
        </div>
      </div>
    );
  }

  const filed = formatDate(blog.publishDate);
  const imgSrc = resolveImage(blog.image);
  const hasBody = Boolean(blog.content && blog.content.trim().length > 0);

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
    <div className="container-page pt-10 pb-24">
      <SEO
        title={blog.title}
        description={blog.description}
        canonical={`/blog/${blog.slug}`}
        image={imgSrc || `${SITE_URL}/og-cover.png`}
        type="article"
        keywords={`${(blog.tags || []).join(', ')}, Benjamin Koimett, React Node.js`}
        jsonLd={blogPostingJsonLd}
      />

      <div className="mx-auto max-w-[72ch]">
        <Link to="/blog" className="filigree font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted">
          <span aria-hidden="true">←</span> Note index
        </Link>

        <article className="mt-8">
          <header>
            <p className="file-index-sm">
              BK-BLG-{String(blog.slug).slice(0, 6).toUpperCase()}
              {filed && <> · Filed {filed}</>}
              {blog.readTime && <> · {blog.readTime}</>}
            </p>

            <h1 className="mt-3 text-heading-xl font-semibold leading-[1.08] text-ink">{blog.title}</h1>
            {blog.description && (
              <p className="mt-4 max-w-[62ch] text-body text-ink-muted">{blog.description}</p>
            )}
          </header>

          {imgSrc && (
            <figure className="mt-8">
              <RecordFigure
                project={blog}
                figureNo={`BK-BLG-${blog.slug}`}
                expandable
                imageClassName="aspect-[16/9] w-full border border-rule object-cover"
              />
              <figcaption className="file-index-sm mt-2">
                Fig. BK-BLG / {blog.slug}
              </figcaption>
            </figure>
          )}

          {hasBody ? (
            <RichText text={blog.content} className="mt-10" />
          ) : (
            <div className="mt-10 border-y border-rule py-8">
              <p className="max-w-[62ch] text-body text-ink-muted">
                The body of this note has not been written yet. The summary above is the
                whole of what is on file.
              </p>
            </div>
          )}

          {blog.tags?.length > 0 && (
            <div className="mt-10">
              <h2 className="file-index-sm border-b border-rule pb-2">Filed under</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {blog.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-rule px-2.5 py-1 font-mono text-[12px] text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/blog" className="btn btn-stroke">
              <span aria-hidden="true">←</span> Back to the index
            </Link>
            <Link to="/projects" className="filigree font-mono text-[12px] uppercase tracking-[0.08em]">
              Project records
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;

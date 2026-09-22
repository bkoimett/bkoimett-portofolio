import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import Container from '../components/primitives/Container';
import Section from '../components/primitives/Section';
import SectionHeading from '../components/primitives/SectionHeading';
import Button from '../components/primitives/Button';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/slug/${slug}`, {
          signal: controller.signal,
        });
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
    if (blog?._id) {
      const controller = new AbortController();
      api.post(`/blogs/${blog._id}/view`, {}, { signal: controller.signal }).catch(() => {});
      return () => controller.abort();
    }
  }, [blog]);

  if (loading) {
    return (
      <section className="pt-14">
        <Container>
          <Section>
            <SectionHeading>Blog</SectionHeading>
            <p className="file-index-sm mt-8">Opening the record…</p>
          </Section>
        </Container>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="pt-14">
        <Container>
          <Section>
            <SectionHeading>Blog</SectionHeading>
            <div className="mt-8 text-center">
              <p className="text-body text-ink-muted mb-6">Record not found</p>
              <Link to="/blog" className="btn btn-primary">
                Back to index
              </Link>
            </div>
          </Section>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-14">
      <Container>
        <Section>
          <header className="mb-8">
            <p className="file-index-sm">
              BK / BLOG — FILED {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : '—'}
            </p>
            <h1 className="mt-2 text-heading-xl font-semibold text-ink">{blog.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-body text-ink-muted">
              <span>{blog.readTime}</span>
              {blog.tags?.length && (
                <>
                  <span className="text-rule-strong">·</span>
                  <span>{blog.tags.join(', ')}</span>
                </>
              )}
            </div>
          </header>

          <div className="markdown-body max-w-[60ch] ink leading-relaxed">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          <div className="mt-10 rule-double" />

          <div className="mt-8 flex items-center justify-between">
            <Link to="/blog" className="btn btn-stroke">
              ← Back to index
            </Link>
          </div>
        </Section>
      </Container>
    </section>
  );
};

export default BlogDetail;
import React, { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Section from '../components/primitives/Section';
import SectionHeading from '../components/primitives/SectionHeading';
import Container from '../components/primitives/Container';
import Button from '../components/primitives/Button';

const fallbackBlogs = [
  {
    _id: '1',
    slug: 'building-a-portfolio-registry-my-journey-with-open-source-tools',
    title: 'Building a Portfolio Registry: My Journey with Open-Source Tools',
    description:
      'How I structured my public work as a searchable registry of projects, decisions, and lessons learned -- from early scripts to the filed system you see today.',
    content: `# Building a Portfolio Registry

When I first started sharing code, my repositories were scattered across GitHub with no central coherence. I wanted a system that felt as intentional as the land registries and patient record systems I studied during my training.

So I built one. Inspired by the Registry Office visual language -- hairline rules, mono reference numbers, stamped availability -- I filed every project, every decision, every insight into a searchable case file.

Each entry has a slug, a status, and a read time. Each is cross-referenced with the technologies it touches and the problems it solves. The system is live and public: you can browse the full index, open individual files, or watch view counts tick up as people explore the records.

If you're building too, I recommend starting with a simple ledger. Add a field for status, another for tags, and a timestamp. From there, the registry grows naturally.

---

## Why a registry instead of a blog?

A blog implies chronology. A registry implies authority. By treating my work as filed documents rather than dated posts, I can link related projects across years without forcing a narrative sequence. A new project can reference an old one without needing to appear beneath it in a feed.

## What you'll find inside

- **Project files**: every shipped system, from care facilities to land governance
- **Decision notes**: trade-offs I considered, and why I landed where I did
- **Tool surveys**: what levels each technology reaches, and why
- **Read time**: every article estimates how long it takes to reach the end

---

## Getting started

Start at the index. Every record is open. No paywall, no gatekept feed. Just filed systems ready for you to explore at your own pace.`,
    publishDate: new Date('2026-09-21'),
    tags: ['portfolio', 'systems', 'open source', 'registry'],
    readTime: '8 min read',
  },
  {
    _id: '2',
    slug: 'from-registry-records-to-modern-apis-lessons-learned',
    title: 'From Registry Records to Modern APIs: Lessons Learned',
    description:
      'What a land registry, a patient record system, and a farm ledger taught me about designing APIs that survive scale and succession.',
    content: `# From Registry Records to Modern APIs

During my work on registry-backed systems, I built three core platforms: a land title deed verification service for East Africa, a patient records pipeline for a rehabilitation center, and a farm management ledger for smallholder farmers. Each had different constraints, but all three shared a surprising amount in common with the API designs I build today.

## The registry pattern

Every system I worked on started as a filed document. A land title wasn't just data -- it was a record with a registration number, a status stamp, and a chain of custody. A patient chart had similar markers: REG. NO., FILED, AVAILABLE - REMOTE. These aren't decorative. They are the difference between a document that can be located in a crisis and one that disappears.

I carried those markers into the APIs I later built. Every resource gets a slug. Every status is enumerated. Every link carries a reference code. The system is locatable, not just readable.

## Lessons from scale

1. **Idempotency matters**. Just as a land deed can be re-registered without altering the original, API endpoints should handle repeated calls without side effects.
2. **Status as data**. A record's state (draft, published, archived) should be a first-class field, not inferred from context.
3. **Audit trails**. Every change should carry a timestamp and an actor, just as a registry entry is signed and dated.
4. **Measure once, cut twice**. A 60-70 character measure for prose translates to a sane line length for API documentation -- wide enough to be readable, narrow enough to stay scoped.

## What's filed here

The full index is public. You can browse projects by division, filter by technology, or open a single case file by its slug. View counts tick up silently. There's no algorithmic feed, no engagement bait -- just records ready for you to explore at your own pace.`,
    publishDate: new Date('2026-09-21'),
    tags: ['api', 'design', 'lessons', 'registry', 'backend'],
    readTime: '6 min read',
  },
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/api/blogs', {
          signal: controller.signal,
        });
        setBlogs(response.data);
        setLoaded(true);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setBlogs(fallbackBlogs);
          setLoaded(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoaded(true);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, []);

  const displayedBlogs = blogs.length ? blogs : fallbackBlogs;

  return (
    <section className="pt-14">
      <Container>
        <Section>
          <SectionHeading>
            Blog
          </SectionHeading>

          <div className="mt-8 space-y-8">
            {displayedBlogs.slice(0, 2).map((blog, i) => (
              <div className="markdown-body max-w-[60ch] ink leading-relaxed">
                <header className="mb-6">
                  <p className="file-index-sm mb-2">
                    BK / BLOG -- POSTED {blog.publishDate instanceof Date ? blog.publishDate.toLocaleDateString() : blog.publishDate}
                  </p>
                  <h2 className="text-heading text-ink font-semibold">{blog.title}</h2>
                  <div className="mt-3 text-body text-ink-muted">
                    {blog.readTime} · {blog.tags?.length ? blog.tags.join(', ') : 'General'}
                  </div>
                </header>

                <div className="mt-4">
                  <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="btn btn-primary"
                  >
                    Read full entry
                  </Link>
                </div>
              </div>
            ))}

            {displayedBlogs.length < 2 && (
              <p className="text-body text-ink-muted">
                More records are filed daily. Check the index again soon.
              </p>
            )}
          </div>
        </Section>
      </Container>
    </section>
  );
};

export default Blog;
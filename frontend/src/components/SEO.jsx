import { useEffect } from 'react';
import { SITE_URL, OG_IMAGE, OG_IMAGE_FALLBACK } from '../utils/seo';

function upsertMeta(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  keywords,
  noindex = false,
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} – Benjamin K. Koimett` : 'Benjamin Kiprotich Koimett – Full-Stack Engineer (React, Node.js, MERN) | Kisumu & Remote';
    document.title = fullTitle;

    const desc =
      description ||
      'Full-stack software engineer shipping React + Node.js production systems – healthcare, land governance, agriculture. View project records and filed notes. Kisumu, Kenya – remote-ready.';
    const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
    const img = image || OG_IMAGE;

    upsertMeta('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    }).setAttribute('content', desc);

    if (keywords) {
      upsertMeta('meta[name="keywords"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'keywords');
        return m;
      }).setAttribute('content', keywords);
    }

    upsertMeta('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }).setAttribute('href', url);

    // robots
    upsertMeta('meta[name="robots"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'robots');
      return m;
    }).setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Open Graph
    const ogProps = {
      'og:title': fullTitle,
      'og:description': desc,
      'og:url': url,
      'og:type': type,
      'og:image': img,
      'og:image:alt': title || 'Benjamin K. Koimett – portfolio cover',
      'og:site_name': 'Benjamin K. Koimett – Record of Production',
    };
    Object.entries(ogProps).forEach(([prop, content]) => {
      upsertMeta(`meta[property="${prop}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute('property', prop);
        return m;
      }).setAttribute('content', content);
    });

    // Twitter
    const twProps = {
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': desc,
      'twitter:image': img || OG_IMAGE_FALLBACK,
      'twitter:creator': '@bkoimett',
    };
    Object.entries(twProps).forEach(([name, content]) => {
      upsertMeta(`meta[name="${name}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute('name', name);
        return m;
      }).setAttribute('content', content);
    });

    // JSON-LD
    const existing = document.head.querySelector('script[data-seo-jsonld]');
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup not needed for SPA – next route will overwrite
  }, [title, description, canonical, image, type, keywords, noindex, jsonLd]);

  return null;
}

export const SITE_URL = 'https://bkoimett-portofolio.vercel.app';
export const SITE_NAME = 'Benjamin K. Koimett — Record of Production';
export const SITE_AUTHOR = 'Benjamin Kiprotich Koimett';
export const SITE_DESCRIPTION =
  'Full-stack software engineer (React, Node.js, MongoDB, Express) shipping production systems in healthcare, agriculture, land governance and Web3. Based in Kisumu, Kenya — remote-ready. Explore project records and filed blog notes.';
export const SITE_KEYWORDS =
  'Benjamin Koimett, Benjamin Kiprotich Koimett, full-stack engineer, MERN stack, React developer, Node.js developer, MongoDB, Express, TypeScript, Golang, Kenya developer, Kisumu, remote developer, healthcare platform, LandLedger';
export const OG_IMAGE = `${SITE_URL}/og-cover.png`;
export const OG_IMAGE_FALLBACK = 'https://res.cloudinary.com/deci4v6zv/image/upload/v1789670149/bkoimett1_asizun.png';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_AUTHOR,
  url: SITE_URL,
  image: OG_IMAGE_FALLBACK,
  jobTitle: 'Full-Stack Software Engineer',
  address: { '@type': 'PostalAddress', addressLocality: 'Kisumu', addressCountry: 'KE' },
  email: 'mailto:koimettb@gmail.com',
  sameAs: [
    'https://github.com/bkoimett',
    'https://linkedin.com/in/benjaminkoimett',
    'https://dev.to/bwanachairman',
  ],
  knowsAbout: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Golang', 'PostgreSQL', 'Tailwind CSS'],
  description: SITE_DESCRIPTION,
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  author: { '@type': 'Person', name: SITE_AUTHOR },
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
};

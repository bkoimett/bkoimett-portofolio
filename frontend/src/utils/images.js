import { mediaOrigin } from './api';

/* A record's image may arrive as an absolute URL, as a path served by the
   API, or not at all. Resolve what exists; return null for the rest so the
   caller can draw a figure instead. */
export const resolveImage = (src) => {
  if (!src) return null;
  if (/^(https?:)?\/\//.test(src)) return src;
  if (src.startsWith('/api/')) {
    return mediaOrigin.startsWith('http') ? `${mediaOrigin}${src}` : src;
  }
  return src;
};

export default resolveImage;

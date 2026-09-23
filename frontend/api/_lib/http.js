// Small response helpers shared by the Vercel API functions, so every handler
// emits the same JSON error/method shapes the legacy Express backend used.

export function sendJson(res, status, body, headers = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  return res.status(status).json(body);
}

export const methodNotAllowed = (res) => sendJson(res, 405, { error: 'Method Not Allowed' });

export const notFound = (res, error) => sendJson(res, 404, { error });

export const badRequest = (res, error) => sendJson(res, 400, { error });

export const unauthorized = (res, error) => sendJson(res, 401, { error });

export const internalError = (res, error) => sendJson(res, 500, { error });

// Public GET responses may be cached; admin-aware routes must NOT use this
// (a cached admin listing could leak drafts to anonymous visitors).
export const PUBLIC_CACHE = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
};
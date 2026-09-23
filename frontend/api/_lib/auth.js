/* global process */
// JWT verification for Vercel functions — mirrors the role of
// backend/middleware/auth.js. Custom admin tokens (JWT_SECRET) stay in use
// until Phase 5 replaces them with Supabase Auth. Always wraps verification
// in try/catch: malformed/expired tokens must resolve to null (→ 401), never
// crash the function.
import jwt from 'jsonwebtoken';

export function verifyAdminToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
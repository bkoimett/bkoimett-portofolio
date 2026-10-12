/* global process */
// POST /api/admin/login – admin sign-in (custom JWT until Phase 5).
// Mirrors backend POST /api/admin/login: same "Invalid credentials" for both
// unknown username and bad password (never reveal which), bcrypt check, 7d token.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminClient } from '../_lib/supabase.js';
import { sendJson, unauthorized, internalError } from '../_lib/http.js';

// Best-effort in-memory rate limiter (one window per warm function instance,
// mirrors the legacy express-rate-limit: max 5 attempts / 15 min / IP).
const attemptStamps = new Map();

function prune() {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, stamps] of attemptStamps) {
    const kept = stamps.filter((t) => t > cutoff);
    if (kept.length) attemptStamps.set(key, kept);
    else attemptStamps.delete(key);
  }
}

function rateLimited(ip) {
  prune();
  const stamps = attemptStamps.get(ip) || [];
  if (stamps.length >= 5) return true;
  stamps.push(Date.now());
  attemptStamps.set(ip, stamps);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });

  const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const ip = String(rawIp).split(',')[0].trim();
  if (rateLimited(ip)) {
    return sendJson(res, 429, { error: 'Too many login attempts. Please try again later.' });
  }

  try {
    const { username, password } = req.body || {};
    if (!username || !password) return unauthorized(res, 'Invalid credentials');

    const client = getAdminClient();
    const { data: admin, error } = await client
      .from('admins')
      .select('id, username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) return internalError(res, 'An error occurred during login');
    if (!admin) return unauthorized(res, 'Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) return unauthorized(res, 'Invalid credentials');

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendJson(res, 200, { token, message: 'Login successful' });
  } catch {
    return internalError(res, 'An error occurred during login');
  }
}
// PUT /api/admin/settings — update admin username/password (admin only).
// Mirrors backend PUT /api/admin/settings validation and messages.
import bcrypt from 'bcryptjs';
import { getAdminClient } from '../_lib/supabase.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { sendJson, badRequest, notFound, unauthorized, internalError } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return sendJson(res, 405, { error: 'Method Not Allowed' });

  const user = verifyAdminToken(req);
  if (!user) return unauthorized(res, 'Invalid token');

  try {
    const { newUsername, newPassword } = req.body || {};
    const trimmedUsername = typeof newUsername === 'string' ? newUsername.trim() : '';

    if (!trimmedUsername && !newPassword) {
      return badRequest(res, 'No settings provided');
    }
    if (trimmedUsername && trimmedUsername.length < 3) {
      return badRequest(res, 'Username must be at least 3 characters long');
    }
    if (newPassword && newPassword.length < 6) {
      return badRequest(res, 'Password must be at least 6 characters long');
    }

    const client = getAdminClient();
    const { data: admin, error } = await client
      .from('admins')
      .select('id, username')
      .eq('id', user.id)
      .maybeSingle();

    if (error) return internalError(res, 'Failed to update settings');
    if (!admin) return notFound(res, 'Admin not found');

    if (trimmedUsername && trimmedUsername !== admin.username) {
      const { data: existing } = await client
        .from('admins')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();
      if (existing) return badRequest(res, 'Username already taken');
    }

    const updates = {};
    if (trimmedUsername) updates.username = trimmedUsername;
    if (newPassword) updates.password_hash = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await client
      .from('admins')
      .update(updates)
      .eq('id', user.id);

    if (updateError) return internalError(res, 'Failed to update settings');

    return sendJson(res, 200, {
      message: 'Settings updated successfully',
      username: trimmedUsername || admin.username,
    });
  } catch {
    return internalError(res, 'Failed to update settings');
  }
}
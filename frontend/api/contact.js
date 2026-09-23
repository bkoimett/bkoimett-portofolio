// POST /api/contact — public contact form (acknowledges without logging PII;
// no email provider wired up in the legacy backend either).
import { sendJson, badRequest, internalError, methodNotAllowed } from './_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return badRequest(res, 'Name, email, and message are required');
    }
    return sendJson(res, 200, { success: true, message: 'Message received!' });
  } catch {
    return internalError(res, 'Failed to process contact form');
  }
}
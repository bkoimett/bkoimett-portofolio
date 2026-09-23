/* global process */
// Server-side Supabase client abstraction — Vercel functions only.
//
// NEVER import this from the browser bundle. It holds the service-role key.
// One shared client; do not scatter new Supabase instances through `api/`.
//
// Environment (server-only secrets, set in Vercel):
//   SUPABASE_URL                 — https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    — service role (admin; bypasses RLS)
//   SUPABASE_ANON_KEY            — publishable key (public reads, auth only)
//   SUPABASE_JWT_SECRET          — JWT secret for verifying Supabase Auth tokens (Phase 5)

import { createClient } from '@supabase/supabase-js';

function required(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildOptions() {
  return {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      // Long enough for uploads/downloads (default 0 = no timeout can hang poor
      // Vercel functions; 60s keeps cold-rare + large-file uploads reliable).
      headers: { 'apikey': process.env.SUPABASE_ANON_KEY || '' },
    },
  };
}

// Service-role client: all admin reads/writes (projects/blogs/cvs/images) and
// storage management go through this. Throws at first call if misconfigured —
// fails the function fast instead of leaking a confusing Supabase error.
export const getAdminClient = () => {
  const url = required('SUPABASE_URL', process.env.SUPABASE_URL);
  const key = required('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
  return createClient(url, key, buildOptions());
};

// Anon (publishable) client: used only where the browser's anon key is valid,
// e.g. verifying Supabase Auth JWTs or public reads. Never exposes secrets.
export const getAnonClient = () => {
  const url = required('SUPABASE_URL', process.env.SUPABASE_URL);
  const key = required('SUPABASE_ANON_KEY', process.env.SUPABASE_ANON_KEY);
  return createClient(url, key, buildOptions());
};
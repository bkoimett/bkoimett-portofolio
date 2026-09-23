-- =============================================================================
-- 0001_initial_schema.sql
-- Registry Office portfolio — PostgreSQL schema for Supabase
--
-- Migrates the MongoDB collections (projects, blogs, cvs, admins) to Postgres.
-- Primary keys are TEXT so legacy MongoDB ObjectIds can be preserved verbatim
-- during data migration; new rows use a UUID string. The frontend `_id` contract
-- and `/api/*/:id/view` URLs therefore keep working unchanged.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- projects
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id            text primary key,
  title         text not null,
  slug          text not null,
  description   text not null,
  category      text,
  image         text,
  technologies  text[] not null default '{}',
  github        text,
  demo          text,
  highlights    text[] not null default '{}',
  content       text not null default '',
  publish_date  timestamptz,
  tags          text[] not null default '{}',
  read_time     text not null default '5 min read',
  status        text not null default 'published'
                constraint projects_status_check check (status in ('draft', 'published')),
  views         integer not null default 0
                constraint projects_views_nonneg check (views >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint projects_slug_unique unique (slug)
);

create index if not exists projects_status_idx        on public.projects (status);
create index if not exists projects_publish_date_idx  on public.projects (publish_date desc);
create index if not exists projects_created_at_idx    on public.projects (created_at desc);

-- -----------------------------------------------------------------------------
-- blogs
-- -----------------------------------------------------------------------------
create table if not exists public.blogs (
  id            text primary key,
  title         text not null,
  slug          text not null,
  description   text not null,
  content       text not null,
  image         text,
  tags          text[] not null default '{}',
  read_time     text not null default '5 min read',
  publish_date  timestamptz,
  status        text not null default 'published'
                constraint blogs_status_check check (status in ('draft', 'published')),
  views         integer not null default 0
                constraint blogs_views_nonneg check (views >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint blogs_slug_unique unique (slug)
);

create index if not exists blogs_status_idx       on public.blogs (status);
create index if not exists blogs_publish_date_idx on public.blogs (publish_date desc);
create index if not exists blogs_created_at_idx   on public.blogs (created_at desc);

-- -----------------------------------------------------------------------------
-- cvs
-- -----------------------------------------------------------------------------
create table if not exists public.cvs (
  id            text primary key,
  label         text not null default '',
  file_name     text not null,
  content_type  text not null,
  size          bigint not null default 0,
  storage_path  text not null,          -- object path inside the private portfolio-cvs bucket
  active        boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Single-active CV invariant enforced at the database level (was app-only in Mongo).
create unique index if not exists cvs_single_active
  on public.cvs ((true)) where active;

create index if not exists cvs_created_at_idx on public.cvs (created_at desc);

-- -----------------------------------------------------------------------------
-- admins
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  id            text primary key,
  username      text not null
                constraint admins_username_unique unique,
  password_hash text not null,          -- bcrypt; never plaintext
  auth_user_id  uuid references auth.users (id) on delete set null,  -- Supabase Auth (Phase 5)
  created_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
-- The public API is served by Vercel functions using the Supabase service role
-- (which bypasses RLS). These policies are defense-in-depth: if an anon key is
-- ever leaked, anonymous access is limited to intentionally public rows and has
-- no mutation path. Admin mutations happen server-side only, never via anon.

alter table public.projects enable row level security;
alter table public.blogs    enable row level security;
alter table public.cvs      enable row level security;
alter table public.admins   enable row level security;

-- Public can only read published projects/blogs.
create policy projects_public_read on public.projects
  for select to anon
  using (status = 'published');

create policy blogs_public_read on public.blogs
  for select to anon
  using (status = 'published');

-- Public can read metadata of the active CV only (file itself is private storage).
create policy cvs_public_read on public.cvs
  for select to anon
  using (active = true);

-- No public insert/update/delete anywhere. Admins table: no public read at all.
-- `grant` defaults from Supabase already allow anon to attempt statements; RLS
-- forces every row to fail the policy checks above for any mutation.

-- Revoke any direct table mutations from anon/authenticated (defense in depth).
revoke insert, update, delete on public.projects, public.blogs, public.cvs, public.admins from anon;
revoke insert, update, delete on public.projects, public.blogs, public.cvs, public.admins from authenticated;

-- Authenticated (Supabase Auth) users may read the same public surface; admin
-- CRUD remains a service-role + Vercel-function responsibility.
create policy projects_authenticated_read on public.projects
  for select to authenticated
  using (status = 'published');

create policy blogs_authenticated_read on public.blogs
  for select to authenticated
  using (status = 'published');

create policy cvs_authenticated_read on public.cvs
  for select to authenticated
  using (active = true);
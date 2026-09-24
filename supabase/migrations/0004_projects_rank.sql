-- =============================================================================
-- 0004_projects_rank.sql
-- Adds a manual star ranking to projects. Higher rank surfaces first on the
-- public landing page and the project index; ties fall back to created_at.
-- Admin sets it from the console (5-star control), 0 = unranked.
-- =============================================================================

alter table public.projects
  add column if not exists rank integer not null default 0
  constraint projects_rank_nonneg check (rank >= 0);

create index if not exists projects_rank_idx on public.projects (rank desc);

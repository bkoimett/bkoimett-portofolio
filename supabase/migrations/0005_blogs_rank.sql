-- =============================================================================
-- 0005_blogs_rank.sql
-- Adds a manual star ranking to blog posts. Higher rank surfaces first on the
-- public blog index; ties fall back to publish_date. Admin sets it from the
-- console (5-star control), 0 = unranked.
-- =============================================================================

alter table public.blogs
  add column if not exists rank integer not null default 0
  constraint blogs_rank_nonneg check (rank >= 0);

create index if not exists blogs_rank_idx on public.blogs (rank desc);

-- =============================================================================
-- 0003_views_rpc.sql
-- Registry Office portfolio – atomic view-count increments
--
-- Replaces Mongoose `findByIdAndUpdate(id, { $inc: { views: 1 } })` used by
-- POST /api/projects/:id/view and POST /api/blogs/:id/view. A single UPDATE
-- statement is atomic, so a live-read + write approach would lose increments
-- under concurrency. As in the Express routes, the increment applies to ANY
-- matching id (draft or published) and does NOT touch updated_at (the legacy
-- schemas have manual timestamps and $inc does not modify them).
--
-- Each function returns the NEW view count, or NULL when no row matched –
-- the Vercel handler maps NULL to 404.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- increment_project_view(p_id text) -> integer (new count) | null (not found)
-- -----------------------------------------------------------------------------
create or replace function public.increment_project_view(p_id text)
returns integer
language plpgsql
set search_path = public
as $$
declare
  new_views integer;
begin
  update public.projects
     set views = views + 1
   where id = p_id
   returning views into new_views;

  if new_views is null then
    return null;
  end if;

  return new_views;
end;
$$;

-- -----------------------------------------------------------------------------
-- increment_blog_view(p_id text) -> integer (new count) | null (not found)
-- -----------------------------------------------------------------------------
create or replace function public.increment_blog_view(p_id text)
returns integer
language plpgsql
set search_path = public
as $$
declare
  new_views integer;
begin
  update public.blogs
     set views = views + 1
   where id = p_id
   returning views into new_views;

  if new_views is null then
    return null;
  end if;

  return new_views;
end;
$$;
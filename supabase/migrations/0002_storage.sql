-- =============================================================================
-- 0002_storage.sql
-- Registry Office portfolio – Supabase Storage buckets + policies
--
-- Replaces GridFS buckets:
--   images (public title images) -> portfolio-images (public bucket)
--   cvs    (PDF curriculum vitae) -> portfolio-cvs (private bucket)
--
-- Object path conventions (maintained by the API/migration tooling):
--   portfolio-images/projects/<file>
--   portfolio-images/blogs/<file>
--   portfolio-cvs/current/<file>          (active/current CV)
--   portfolio-cvs/archive/<file>          (previous versions)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Buckets
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-cvs', 'portfolio-cvs', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Storage RLS (defense in depth; service role bypasses for admin functions)
-- -----------------------------------------------------------------------------

-- Public images bucket: anyone can read public title images.
create policy "portfolio-images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio-images');

-- No public mutation of any bucket.
create policy "portfolio-images authenticated write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-images');

create policy "portfolio-images authenticated update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-images')
  with check (bucket_id = 'portfolio-images');

create policy "portfolio-images authenticated delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-images');

-- Private CV bucket: no anonymous read (CV files are not publicly enumerable).
-- Admin upload/delete flows run through Vercel functions with the service role.
create policy "portfolio-cvs authenticated write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-cvs');

create policy "portfolio-cvs authenticated update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-cvs')
  with check (bucket_id = 'portfolio-cvs');

create policy "portfolio-cvs authenticated delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-cvs');
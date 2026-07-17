-- =============================================================
-- Kariri Valley — 0008: bucket de fotos de perfil (RN-011)
-- 2MB máx., JPG/PNG/WebP, leitura pública, escrita na própria pasta
-- =============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-photos', 'member-photos', true,
  2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "member_photos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'member-photos');

create policy "member_photos_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "member_photos_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "member_photos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

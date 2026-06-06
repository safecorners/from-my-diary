create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 8000),
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.diary_entries enable row level security;

grant select, insert, update, delete on public.diary_entries to authenticated;

drop policy if exists "diary entries are readable by owner" on public.diary_entries;
drop policy if exists "diary entries are insertable by owner" on public.diary_entries;
drop policy if exists "diary entries are updateable by owner" on public.diary_entries;
drop policy if exists "diary entries are deletable by owner" on public.diary_entries;

create policy "diary entries are readable by owner"
on public.diary_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "diary entries are insertable by owner"
on public.diary_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "diary entries are updateable by owner"
on public.diary_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "diary entries are deletable by owner"
on public.diary_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diary-photos',
  'diary-photos',
  false,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "diary photos are readable by owner" on storage.objects;
drop policy if exists "diary photos are insertable by owner" on storage.objects;
drop policy if exists "diary photos are deletable by owner" on storage.objects;

create policy "diary photos are readable by owner"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'diary-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "diary photos are insertable by owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'diary-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "diary photos are deletable by owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'diary-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

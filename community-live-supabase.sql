create extension if not exists pgcrypto;

create table if not exists public.community_profiles (
  user_id text primary key,
  display_name text not null,
  handle text not null,
  bio text default '',
  color text default '#0A7266',
  avatar_text text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.community_presence (
  user_id text primary key references public.community_profiles(user_id) on delete cascade,
  display_name text not null,
  handle text not null,
  color text default '#0A7266',
  current_page text default 'Community',
  status text default 'online' check (status in ('online', 'away', 'offline')),
  last_seen timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.community_profiles(user_id) on delete cascade,
  author_name text not null,
  handle text not null,
  color text default '#0A7266',
  post_type text not null default 'update',
  body text default '',
  gif_url text default '',
  gif_title text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.community_pods (
  id uuid primary key default gen_random_uuid(),
  created_by text not null references public.community_profiles(user_id) on delete cascade,
  name text not null unique,
  emoji text default 'POD',
  description text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.community_pod_members (
  pod_id uuid not null references public.community_pods(id) on delete cascade,
  user_id text not null references public.community_profiles(user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (pod_id, user_id)
);

create table if not exists public.community_challenges (
  id uuid primary key default gen_random_uuid(),
  created_by text not null references public.community_profiles(user_id) on delete cascade,
  name text not null,
  description text default '',
  days integer not null default 30 check (days between 1 and 365),
  created_at timestamptz not null default now()
);

create table if not exists public.community_challenge_members (
  challenge_id uuid not null references public.community_challenges(id) on delete cascade,
  user_id text not null references public.community_profiles(user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create index if not exists community_posts_created_at_idx
  on public.community_posts(created_at desc);

create index if not exists community_pods_created_at_idx
  on public.community_pods(created_at desc);

create index if not exists community_challenges_created_at_idx
  on public.community_challenges(created_at desc);

alter table public.community_profiles enable row level security;
alter table public.community_presence enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_pods enable row level security;
alter table public.community_pod_members enable row level security;
alter table public.community_challenges enable row level security;
alter table public.community_challenge_members enable row level security;

drop policy if exists community_profiles_select on public.community_profiles;
drop policy if exists community_profiles_insert on public.community_profiles;
drop policy if exists community_profiles_update on public.community_profiles;
drop policy if exists community_profiles_delete on public.community_profiles;

create policy community_profiles_select
on public.community_profiles
for select
to authenticated
using (true);

create policy community_profiles_insert
on public.community_profiles
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy community_profiles_update
on public.community_profiles
for update
to authenticated
using ((select auth.uid())::text = user_id)
with check ((select auth.uid())::text = user_id);

create policy community_profiles_delete
on public.community_profiles
for delete
to authenticated
using ((select auth.uid())::text = user_id);

drop policy if exists community_presence_select on public.community_presence;
drop policy if exists community_presence_insert on public.community_presence;
drop policy if exists community_presence_update on public.community_presence;
drop policy if exists community_presence_delete on public.community_presence;

create policy community_presence_select
on public.community_presence
for select
to authenticated
using (true);

create policy community_presence_insert
on public.community_presence
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy community_presence_update
on public.community_presence
for update
to authenticated
using ((select auth.uid())::text = user_id)
with check ((select auth.uid())::text = user_id);

create policy community_presence_delete
on public.community_presence
for delete
to authenticated
using ((select auth.uid())::text = user_id);

drop policy if exists community_posts_select on public.community_posts;
drop policy if exists community_posts_insert on public.community_posts;
drop policy if exists community_posts_update on public.community_posts;
drop policy if exists community_posts_delete on public.community_posts;

create policy community_posts_select
on public.community_posts
for select
to authenticated
using (true);

create policy community_posts_insert
on public.community_posts
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy community_posts_update
on public.community_posts
for update
to authenticated
using ((select auth.uid())::text = user_id)
with check ((select auth.uid())::text = user_id);

create policy community_posts_delete
on public.community_posts
for delete
to authenticated
using ((select auth.uid())::text = user_id);

drop policy if exists community_pods_select on public.community_pods;
drop policy if exists community_pods_insert on public.community_pods;
drop policy if exists community_pods_update on public.community_pods;
drop policy if exists community_pods_delete on public.community_pods;

create policy community_pods_select
on public.community_pods
for select
to authenticated
using (true);

create policy community_pods_insert
on public.community_pods
for insert
to authenticated
with check ((select auth.uid())::text = created_by);

create policy community_pods_update
on public.community_pods
for update
to authenticated
using ((select auth.uid())::text = created_by)
with check ((select auth.uid())::text = created_by);

create policy community_pods_delete
on public.community_pods
for delete
to authenticated
using ((select auth.uid())::text = created_by);

drop policy if exists community_pod_members_select on public.community_pod_members;
drop policy if exists community_pod_members_insert on public.community_pod_members;
drop policy if exists community_pod_members_delete on public.community_pod_members;

create policy community_pod_members_select
on public.community_pod_members
for select
to authenticated
using (true);

create policy community_pod_members_insert
on public.community_pod_members
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy community_pod_members_delete
on public.community_pod_members
for delete
to authenticated
using ((select auth.uid())::text = user_id);

drop policy if exists community_challenges_select on public.community_challenges;
drop policy if exists community_challenges_insert on public.community_challenges;
drop policy if exists community_challenges_update on public.community_challenges;
drop policy if exists community_challenges_delete on public.community_challenges;

create policy community_challenges_select
on public.community_challenges
for select
to authenticated
using (true);

create policy community_challenges_insert
on public.community_challenges
for insert
to authenticated
with check ((select auth.uid())::text = created_by);

create policy community_challenges_update
on public.community_challenges
for update
to authenticated
using ((select auth.uid())::text = created_by)
with check ((select auth.uid())::text = created_by);

create policy community_challenges_delete
on public.community_challenges
for delete
to authenticated
using ((select auth.uid())::text = created_by);

drop policy if exists community_challenge_members_select on public.community_challenge_members;
drop policy if exists community_challenge_members_insert on public.community_challenge_members;
drop policy if exists community_challenge_members_delete on public.community_challenge_members;

create policy community_challenge_members_select
on public.community_challenge_members
for select
to authenticated
using (true);

create policy community_challenge_members_insert
on public.community_challenge_members
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy community_challenge_members_delete
on public.community_challenge_members
for delete
to authenticated
using ((select auth.uid())::text = user_id);

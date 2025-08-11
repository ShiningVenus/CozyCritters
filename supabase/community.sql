-- CozyCritters community schema
-- Safe for Supabase. RLS-first. Public reads for public content. Private nests gated by membership.

-- =========================
-- Extensions
-- =========================
create extension if not exists pgcrypto;
create extension if not exists citext;

-- =========================
-- Tables
-- =========================

-- Profiles mirror auth.users and are populated by trigger
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username citext not null unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','moderator')),
  created_at timestamptz not null default now()
);

-- Nests are user created communities
create table if not exists nests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

-- Optional uniqueness of nest names per owner
create unique index if not exists nests_owner_name_uidx on nests (owner_id, lower(name));

-- Members of nests
create table if not exists nest_members (
  nest_id uuid not null references nests(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (nest_id, profile_id)
);

-- Discussion threads
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  nest_id uuid not null references nests(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Posts inside threads
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reactions to posts
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  created_at timestamptz not null default now(),
  unique (post_id, author_id, type),
  constraint reactions_type_ck check (type in ('like','love','laugh','wow','sad','angry'))
);

-- Flags for moderation
create table if not exists flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  reporter_id uuid not null references profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

-- =========================
-- Helpful indexes
-- =========================
create index if not exists profiles_username_trgm on profiles (username);
create index if not exists nests_owner_id_idx on nests(owner_id);
create index if not exists nest_members_profile_idx on nest_members(profile_id);
create index if not exists nest_members_nest_idx on nest_members(nest_id);
create index if not exists threads_nest_idx on threads(nest_id);
create index if not exists threads_author_idx on threads(author_id);
create index if not exists posts_thread_idx on posts(thread_id);
create index if not exists posts_author_idx on posts(author_id);
create index if not exists reactions_post_idx on reactions(post_id);
create index if not exists reactions_author_idx on reactions(author_id);
create index if not exists flags_post_idx on flags(post_id);
create index if not exists flags_reporter_idx on flags(reporter_id);

-- =========================
-- Triggers for updated_at
-- =========================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists set_threads_updated on threads;
create trigger set_threads_updated
before update on threads
for each row execute function set_updated_at();

drop trigger if exists set_posts_updated on posts;
create trigger set_posts_updated
before update on posts
for each row execute function set_updated_at();

-- =========================
-- Bootstrap profiles on auth signup
-- =========================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username, avatar_url)
  values (new.id, coalesce(nullif(split_part(new.email, '@', 1), ''), encode(gen_random_bytes(6), 'hex')), null)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- =========================
-- Public view for safe profile fields
-- =========================
drop view if exists public_profiles cascade;
create view public_profiles as
  select id, username, avatar_url
  from profiles;

-- Allow anonymous and authenticated reads of the view
grant usage on schema public to anon, authenticated;
grant select on public_profiles to anon, authenticated;

-- =========================
-- Row Level Security
-- =========================
alter table profiles enable row level security;
alter table nests enable row level security;
alter table nest_members enable row level security;
alter table threads enable row level security;
alter table posts enable row level security;
alter table reactions enable row level security;
alter table flags enable row level security;

-- ---------- profiles ----------
-- Users can read and manage their own profile
drop policy if exists "profiles read own" on profiles;
create policy "profiles read own"
on profiles for select
using (auth.uid() = id);

drop policy if exists "profiles upsert own" on profiles;
create policy "profiles upsert own"
on profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- ---------- nests ----------
-- Public nests readable by anyone, owners always see their own
drop policy if exists "nests public read" on nests;
create policy "nests public read"
on nests for select
using (not is_private or owner_id = auth.uid());

-- Members of private nests can read
drop policy if exists "nests members read" on nests;
create policy "nests members read"
on nests for select
using (
  exists (
    select 1 from nest_members nm
    where nm.nest_id = nests.id and nm.profile_id = auth.uid()
  )
  or owner_id = auth.uid()
);

-- Owners manage their nests
drop policy if exists "nests owner manage" on nests;
create policy "nests owner manage"
on nests for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- Moderators can read all nests
drop policy if exists "nests moderator read" on nests;
create policy "nests moderator read"
on nests for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- ---------- nest_members ----------
-- View members of accessible nests
drop policy if exists "members view accessible" on nest_members;
create policy "members view accessible"
on nest_members for select
using (
  exists (
    select 1 from nests n
    where n.id = nest_members.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (
          select 1 from nest_members nm
          where nm.nest_id = n.id and nm.profile_id = auth.uid()
        )
      )
  )
);

-- Join public nests yourself, or owner can add members
drop policy if exists "members self join public" on nest_members;
create policy "members self join public"
on nest_members for insert
with check (
  profile_id = auth.uid()
  and exists (
    select 1 from nests n
    where n.id = nest_members.nest_id
      and not n.is_private
  )
);

drop policy if exists "members owner add" on nest_members;
create policy "members owner add"
on nest_members for insert
with check (
  exists (
    select 1 from nests n
    where n.id = nest_members.nest_id
      and n.owner_id = auth.uid()
  )
);

-- Leave a nest yourself
drop policy if exists "members self leave" on nest_members;
create policy "members self leave"
on nest_members for delete
using (profile_id = auth.uid());

-- Owner can remove any member in their nest
drop policy if exists "members owner remove" on nest_members;
create policy "members owner remove"
on nest_members for delete
using (
  exists (
    select 1 from nests n
    where n.id = nest_members.nest_id
      and n.owner_id = auth.uid()
  )
);

-- ---------- threads ----------
-- Read threads where the nest is public or you have access
drop policy if exists "threads read accessible" on threads;
create policy "threads read accessible"
on threads for select
using (
  exists (
    select 1 from nests n
    where n.id = threads.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Create threads only if you can access the nest
drop policy if exists "threads create if access" on threads;
create policy "threads create if access"
on threads for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from nests n
    where n.id = threads.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Authors manage their own threads
drop policy if exists "threads author manage" on threads;
create policy "threads author manage"
on threads for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "threads author delete"
on threads for delete using (author_id = auth.uid());

-- Moderators can read all threads
drop policy if exists "threads moderator read" on threads;
create policy "threads moderator read"
on threads for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- ---------- posts ----------
-- Read posts where the thread is in an accessible nest
drop policy if exists "posts read accessible" on posts;
create policy "posts read accessible"
on posts for select
using (
  exists (
    select 1 from threads t
    join nests n on n.id = t.nest_id
    where t.id = posts.thread_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Create posts only if you can access the thread's nest
drop policy if exists "posts create if access" on posts;
create policy "posts create if access"
on posts for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from threads t
    join nests n on n.id = t.nest_id
    where t.id = posts.thread_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Authors manage their own posts
drop policy if exists "posts author manage" on posts;
create policy "posts author manage"
on posts for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "posts author delete"
on posts for delete using (author_id = auth.uid());

-- Moderators can read all posts
drop policy if exists "posts moderator read" on posts;
create policy "posts moderator read"
on posts for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- ---------- reactions ----------
-- Read reactions on accessible posts
drop policy if exists "reactions read accessible" on reactions;
create policy "reactions read accessible"
on reactions for select
using (
  exists (
    select 1 from posts p
    join threads t on t.id = p.thread_id
    join nests n on n.id = t.nest_id
    where p.id = reactions.post_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Users manage their own reactions
drop policy if exists "reactions manage own" on reactions;
create policy "reactions manage own"
on reactions for all
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- ---------- flags ----------
-- Any authenticated user can flag posts they can see
drop policy if exists "flags create if access" on flags;
create policy "flags create if access"
on flags for insert
with check (
  reporter_id = auth.uid()
  and exists (
    select 1 from posts p
    join threads t on t.id = p.thread_id
    join nests n on n.id = t.nest_id
    where p.id = flags.post_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- Moderators can view all flags
drop policy if exists "flags moderator read" on flags;
create policy "flags moderator read"
on flags for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- Moderators can delete flagged posts
drop policy if exists "posts moderator delete flagged" on posts;
create policy "posts moderator delete flagged"
on posts for delete
using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator')
  and exists (select 1 from flags f where f.post_id = posts.id)
);

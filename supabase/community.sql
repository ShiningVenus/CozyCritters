
-- CozyCritters community schema (Supabase-ready)
-- Clean apply helper, then full schema with RLS, triggers, indexes, and a public profiles view.

/* =========================================================
   CLEAN APPLY HELPER
   Run this block first if you are reapplying on a non-empty DB.
========================================================= */
do $$
declare
  r record;
begin
  for r in
    select polname, schemaname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','nests','nest_members','threads','posts','reactions','flags')
  loop
    execute format('drop policy if exists %I on %I.%I', r.polname, r.schemaname, r.tablename);
  end loop;
end
$$ language plpgsql;

drop trigger if exists set_threads_updated on public.threads;
drop trigger if exists set_posts_updated on public.posts;
drop trigger if exists on_auth_user_created on auth.users;

drop view if exists public.public_profiles cascade;

/* =========================================================
   EXTENSIONS
========================================================= */
create extension if not exists pgcrypto;
create extension if not exists citext;

/* =========================================================
   TABLES
========================================================= */

-- Profiles mirror auth.users and are populated by trigger
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username citext not null unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','moderator')),
  created_at timestamptz not null default now()
);

-- Nests are user created communities
create table if not exists public.nests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

-- Optional uniqueness of nest names per owner
create unique index if not exists nests_owner_name_uidx on public.nests (owner_id, lower(name));

-- Members of nests
create table if not exists public.nest_members (
  nest_id uuid not null references public.nests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (nest_id, profile_id)
);

-- Discussion threads
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  nest_id uuid not null references public.nests(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Posts inside threads
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reactions to posts
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  created_at timestamptz not null default now(),
  unique (post_id, author_id, type),
  constraint reactions_type_ck check (type in ('like','love','laugh','wow','sad','angry'))
);

-- Flags for moderation
create table if not exists public.flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

/* =========================================================
   INDEXES
========================================================= */
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists nests_owner_id_idx on public.nests(owner_id);
create index if not exists nest_members_profile_idx on public.nest_members(profile_id);
create index if not exists nest_members_nest_idx on public.nest_members(nest_id);
create index if not exists threads_nest_idx on public.threads(nest_id);
create index if not exists threads_author_idx on public.threads(author_id);
create index if not exists posts_thread_idx on public.posts(thread_id);
create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists reactions_post_idx on public.reactions(post_id);
create index if not exists reactions_author_idx on public.reactions(author_id);
create index if not exists flags_post_idx on public.flags(post_id);
create index if not exists flags_reporter_idx on public.flags(reporter_id);

/* =========================================================
   TRIGGERS FOR updated_at
========================================================= */
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists set_threads_updated on public.threads;
create trigger set_threads_updated
before update on public.threads
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated on public.posts;
create trigger set_posts_updated
before update on public.posts
for each row execute function public.set_updated_at();

/* =========================================================
   BOOTSTRAP PROFILES ON AUTH SIGNUP
========================================================= */
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, coalesce(nullif(split_part(new.email, '@', 1), ''), encode(gen_random_bytes(6), 'hex')), null)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

/* =========================================================
   PUBLIC VIEW FOR SAFE PROFILE FIELDS
========================================================= */
create view public.public_profiles as
  select id, username, avatar_url
  from public.profiles;

grant usage on schema public to anon, authenticated;
grant select on public.public_profiles to anon, authenticated;

/* =========================================================
   ROW LEVEL SECURITY
========================================================= */
alter table public.profiles enable row level security;
alter table public.nests enable row level security;
alter table public.nest_members enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.reactions enable row level security;
alter table public.flags enable row level security;

-- profiles: users manage their own profile
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- nests: public readable or owner
drop policy if exists "nests public read" on public.nests;
create policy "nests public read"
on public.nests for select
using (not is_private or owner_id = auth.uid());

-- nests: members of private nests can read
drop policy if exists "nests members read" on public.nests;
create policy "nests members read"
on public.nests for select
using (
  exists (
    select 1 from public.nest_members nm
    where nm.nest_id = public.nests.id and nm.profile_id = auth.uid()
  )
  or owner_id = auth.uid()
);

-- nests: owners manage
drop policy if exists "nests owner manage" on public.nests;
create policy "nests owner manage"
on public.nests for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- nests: moderators can read all
drop policy if exists "nests moderator read" on public.nests;
create policy "nests moderator read"
on public.nests for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- nest_members: view members of accessible nests
drop policy if exists "members view accessible" on public.nest_members;
create policy "members view accessible"
on public.nest_members for select
using (
  exists (
    select 1 from public.nests n
    where n.id = public.nest_members.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (
          select 1 from public.nest_members nm
          where nm.nest_id = n.id and nm.profile_id = auth.uid()
        )
      )
  )
);

-- nest_members: self join public nests
drop policy if exists "members self join public" on public.nest_members;
create policy "members self join public"
on public.nest_members for insert
with check (
  profile_id = auth.uid()
  and exists (
    select 1 from public.nests n
    where n.id = public.nest_members.nest_id
      and not n.is_private
  )
);

-- nest_members: owner can add members
drop policy if exists "members owner add" on public.nest_members;
create policy "members owner add"
on public.nest_members for insert
with check (
  exists (
    select 1 from public.nests n
    where n.id = public.nest_members.nest_id
      and n.owner_id = auth.uid()
  )
);

-- nest_members: self leave
drop policy if exists "members self leave" on public.nest_members;
create policy "members self leave"
on public.nest_members for delete
using (profile_id = auth.uid());

-- nest_members: owner remove
drop policy if exists "members owner remove" on public.nest_members;
create policy "members owner remove"
on public.nest_members for delete
using (
  exists (
    select 1 from public.nests n
    where n.id = public.nest_members.nest_id
      and n.owner_id = auth.uid()
  )
);

-- threads: read where nest accessible
drop policy if exists "threads read accessible" on public.threads;
create policy "threads read accessible"
on public.threads for select
using (
  exists (
    select 1 from public.nests n
    where n.id = public.threads.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- threads: create only if access
drop policy if exists "threads create if access" on public.threads;
create policy "threads create if access"
on public.threads for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.nests n
    where n.id = public.threads.nest_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- threads: authors manage
drop policy if exists "threads author manage" on public.threads;
create policy "threads author manage"
on public.threads for update using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "threads author delete" on public.threads;
create policy "threads author delete"
on public.threads for delete using (author_id = auth.uid());

-- threads: moderators can read all
drop policy if exists "threads moderator read" on public.threads;
create policy "threads moderator read"
on public.threads for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- posts: read where thread's nest accessible
drop policy if exists "posts read accessible" on public.posts;
create policy "posts read accessible"
on public.posts for select
using (
  exists (
    select 1 from public.threads t
    join public.nests n on n.id = t.nest_id
    where t.id = public.posts.thread_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- posts: create only if access
drop policy if exists "posts create if access" on public.posts;
create policy "posts create if access"
on public.posts for insert
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.threads t
    join public.nests n on n.id = t.nest_id
    where t.id = public.posts.thread_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- posts: authors manage
drop policy if exists "posts author manage" on public.posts;
create policy "posts author manage"
on public.posts for update using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "posts author delete" on public.posts;
create policy "posts author delete"
on public.posts for delete using (author_id = auth.uid());

-- posts: moderators can read all
drop policy if exists "posts moderator read" on public.posts;
create policy "posts moderator read"
on public.posts for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- reactions: read reactions on accessible posts
drop policy if exists "reactions read accessible" on public.reactions;
create policy "reactions read accessible"
on public.reactions for select
using (
  exists (
    select 1 from public.posts p
    join public.threads t on t.id = p.thread_id
    join public.nests n on n.id = t.nest_id
    where p.id = public.reactions.post_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- reactions: users manage own
drop policy if exists "reactions manage own" on public.reactions;
create policy "reactions manage own"
on public.reactions for all
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- flags: any authenticated user can flag posts they can access
drop policy if exists "flags create if access" on public.flags;
create policy "flags create if access"
on public.flags for insert
with check (
  reporter_id = auth.uid()
  and exists (
    select 1 from public.posts p
    join public.threads t on t.id = p.thread_id
    join public.nests n on n.id = t.nest_id
    where p.id = public.flags.post_id
      and (
        not n.is_private
        or n.owner_id = auth.uid()
        or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid())
      )
  )
);

-- flags: moderators can view all
drop policy if exists "flags moderator read" on public.flags;
create policy "flags moderator read"
on public.flags for select
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'moderator'));

-- posts: moderators can delete flagged posts
drop policy if exists "posts moderator delete flagged" on public.posts;
create policy "posts moderator delete flagged"
on public.posts for delete
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'moderator')
  and exists (select 1 from public.flags f where f.post_id = public.posts.id)
);

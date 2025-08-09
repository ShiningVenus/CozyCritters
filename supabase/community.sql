-- Schema for CozyCritters community features

-- Enable extension for UUID generation
create extension if not exists pgcrypto;

-- Profiles table mirrors auth.users
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text not null unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','moderator')),
  created_at timestamptz not null default now()
);

-- Nests are user-created communities
create table if not exists nests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

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
  unique (post_id, author_id, type)
);

-- Flags for moderation
create table if not exists flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  reporter_id uuid not null references profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

-- Enable row level security
alter table profiles enable row level security;
alter table nests enable row level security;
alter table nest_members enable row level security;
alter table threads enable row level security;
alter table posts enable row level security;
alter table reactions enable row level security;
alter table flags enable row level security;

-- Profiles: users manage their own profile
create policy "Users can manage own profile" on profiles
for select using (auth.uid() = id)
with check (auth.uid() = id);

-- Public nests can be viewed by anyone
create policy "Public nests readable by anyone" on nests
for select using (not is_private);

-- Members can view private nests
create policy "Members can view private nests" on nests
for select using (
  exists (
    select 1 from nest_members nm
    where nm.nest_id = nests.id
      and nm.profile_id = auth.uid()
  )
);

-- Owners manage their nests
create policy "Owners manage nests" on nests
for all using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- Members table: users can view memberships involving them
create policy "View own memberships" on nest_members
for select using (profile_id = auth.uid());

create policy "Join nests" on nest_members
for insert with check (profile_id = auth.uid());

-- Threads policies
create policy "Public threads readable" on threads
for select using (
  exists (
    select 1 from nests n
    where n.id = threads.nest_id
      and (not n.is_private or
           exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid()))
  )
);

create policy "Authors manage threads" on threads
for all using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Posts policies
create policy "Public posts readable" on posts
for select using (
  exists (
    select 1 from nests n
    join threads t on t.nest_id = n.id
    where t.id = posts.thread_id
      and (not n.is_private or
           exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid()))
  )
);

create policy "Authors manage posts" on posts
for all using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Reactions policies
create policy "Reactions on accessible posts" on reactions
for select using (
  exists (
    select 1 from posts p
    join threads t on t.id = p.thread_id
    join nests n on n.id = t.nest_id
    where p.id = reactions.post_id and
          (not n.is_private or
           exists (select 1 from nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid()))
  )
);

create policy "Users manage reactions" on reactions
for all using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Flags policies
create policy "Any user can flag posts" on flags
for insert with check (reporter_id = auth.uid());

create policy "Moderators view flags" on flags
for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator')
);

-- Moderators can delete flagged posts
create policy "Moderators delete flagged posts" on posts
for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'moderator') and
  exists (select 1 from flags f where f.post_id = posts.id)
);

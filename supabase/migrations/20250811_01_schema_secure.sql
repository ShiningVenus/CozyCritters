-- Secure community schema with RLS, thread locking and flag controls

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists citext;

/* =========================================================
   Role helper functions
========================================================= */
create or replace function public.is_moderator() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('moderator','admin')
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

/* =========================================================
   Tables
========================================================= */
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username citext not null unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','moderator','admin')),
  created_at timestamptz not null default now()
);

create table public.nests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index on public.nests (owner_id, lower(name));

create table public.nest_members (
  nest_id uuid not null references public.nests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (nest_id, profile_id)
);

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  nest_id uuid not null references public.nests(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  created_at timestamptz not null default now(),
  unique (post_id, author_id, type),
  constraint reactions_type_ck check (type in ('like','love','laugh','wow','sad','angry'))
);

create table public.flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

/* =========================================================
   Indexes
========================================================= */
create index on public.profiles (username);
create index on public.nests (owner_id);
create index on public.nest_members (profile_id);
create index on public.nest_members (nest_id);
create index on public.threads (nest_id);
create index on public.threads (author_id);
create index on public.posts (thread_id);
create index on public.posts (author_id);
create index on public.reactions (post_id);
create index on public.reactions (author_id);
create index on public.flags (post_id);
create index on public.flags (reporter_id);

/* =========================================================
   Trigger helpers
========================================================= */
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger set_threads_updated
before update on public.threads
for each row execute function public.set_updated_at();

create trigger set_posts_updated
before update on public.posts
for each row execute function public.set_updated_at();

-- Prevent posting in locked threads unless moderator/admin or author updating own post
create or replace function public.block_posts_in_locked_threads()
returns trigger language plpgsql as $$
declare v_locked boolean;
begin
  select is_locked into v_locked from public.threads where id = coalesce(new.thread_id, old.thread_id);
  if v_locked and not public.is_moderator() then
    if tg_op = 'INSERT' then
      raise exception 'Thread is locked';
    elsif tg_op = 'UPDATE' and old.author_id <> auth.uid() then
      raise exception 'Only moderators can edit posts in locked threads';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end $$;

create trigger check_locked_thread_on_posts
before insert or update on public.posts
for each row execute function public.block_posts_in_locked_threads();

/* =========================================================
   Row Level Security
========================================================= */
alter table public.profiles enable row level security;
alter table public.nests enable row level security;
alter table public.nest_members enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.reactions enable row level security;
alter table public.flags enable row level security;

-- Profiles policies
create policy "profiles self" on public.profiles
  for select using (id = auth.uid());
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid());

-- Nests policies
create policy "nests view" on public.nests
  for select using (not is_private or owner_id = auth.uid() or public.is_moderator());
create policy "nests insert" on public.nests
  for insert with check (auth.uid() is not null);
create policy "nests update" on public.nests
  for update using (owner_id = auth.uid() or public.is_moderator());

-- Nest members policies
create policy "members view" on public.nest_members
  for select using (
    exists (
      select 1 from public.nests n
      where n.id = nest_members.nest_id
        and (not n.is_private or n.owner_id = auth.uid()
             or exists (select 1 from public.nest_members nm where nm.nest_id = n.id and nm.profile_id = auth.uid()))
    )
  );
create policy "members insert" on public.nest_members
  for insert with check (
    exists (
      select 1 from public.nests n
      where n.id = nest_members.nest_id and (n.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy "members delete" on public.nest_members
  for delete using (
    profile_id = auth.uid() or
    exists (
      select 1 from public.nests n
      where n.id = nest_members.nest_id and (n.owner_id = auth.uid() or public.is_admin())
    )
  );

-- Threads policies
create policy "threads view" on public.threads
  for select using (true);
create policy "threads insert" on public.threads
  for insert with check (
    exists (
      select 1 from public.nest_members nm where nm.nest_id = threads.nest_id and nm.profile_id = auth.uid()
    )
  );
create policy "threads update own" on public.threads
  for update using (author_id = auth.uid());
create policy "threads moderator manage" on public.threads
  for update using (public.is_moderator());

-- Posts policies
create policy "posts view" on public.posts
  for select using (true);
create policy "posts insert" on public.posts
  for insert with check (
    exists (
      select 1 from public.threads t
      where t.id = posts.thread_id
        and exists (
          select 1 from public.nest_members nm where nm.nest_id = t.nest_id and nm.profile_id = auth.uid()
        )
    )
  );
create policy "posts update own" on public.posts
  for update using (author_id = auth.uid());
create policy "posts delete own" on public.posts
  for delete using (author_id = auth.uid());
create policy "posts moderator manage" on public.posts
  for all using (public.is_moderator());

-- Reactions policies
create policy "reactions view" on public.reactions
  for select using (true);
create policy "reactions insert" on public.reactions
  for insert with check (author_id = auth.uid());
create policy "reactions delete own" on public.reactions
  for delete using (author_id = auth.uid());

-- Flags policies
create policy "flags view own" on public.flags
  for select using (reporter_id = auth.uid() or public.is_moderator());
create policy "flags insert" on public.flags
  for insert with check (reporter_id = auth.uid());
create policy "flags moderator delete" on public.flags
  for delete using (public.is_moderator());

/* =========================================================
   Grants
========================================================= */
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.nests to authenticated;
grant select, insert, update, delete on table public.nest_members to authenticated;
grant select, insert, update, delete on table public.threads to authenticated;
grant select, insert, update, delete on table public.posts to authenticated;
grant select, insert, update, delete on table public.reactions to authenticated;
grant select, insert, update, delete on table public.flags to authenticated;


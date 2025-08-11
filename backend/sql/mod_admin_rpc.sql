
/* =========================================================
   CozyCritters Moderator/Admin RPCs (Supabase-ready)
   Assumes schema from community.secure.sql is applied.
   Run this as a follow-up migration.
========================================================= */

-- Safety: run in public schema
set search_path = public;

-- ========== MODERATION QUEUE ==========
-- Return flags with post, thread, nest, and author info for a dashboard
create or replace function public.get_moderation_queue()
returns table (
  flag_id uuid,
  flagged_at timestamptz,
  reason text,
  post_id uuid,
  post_author uuid,
  post_content text,
  thread_id uuid,
  thread_title text,
  nest_id uuid,
  nest_name text,
  reporter_id uuid
) language sql stable security invoker as $$
  select
    f.id as flag_id,
    f.created_at as flagged_at,
    f.reason,
    p.id as post_id,
    p.author_id as post_author,
    p.content as post_content,
    t.id as thread_id,
    t.title as thread_title,
    n.id as nest_id,
    n.name as nest_name,
    f.reporter_id
  from public.flags f
  join public.posts p on p.id = f.post_id
  join public.threads t on t.id = p.thread_id
  join public.nests n on n.id = t.nest_id
  order by f.created_at desc;
$$;

-- RLS allows moderators to select from flags/posts/threads/nests, so no special grants needed.
grant execute on function public.get_moderation_queue() to authenticated;

-- ========== THREAD LOCK / DELETE ==========
-- Lock or unlock a thread
create or replace function public.lock_thread(p_thread uuid, p_locked boolean default true)
returns void language plpgsql security invoker as $$
begin
  update public.threads
     set is_locked = p_locked
   where id = p_thread;
end $$;
grant execute on function public.lock_thread(uuid, boolean) to authenticated;

-- Convenience wrappers
create or replace function public.unlock_thread(p_thread uuid)
returns void language sql security invoker as $$
  update public.threads set is_locked = false where id = p_thread;
$$;
grant execute on function public.unlock_thread(uuid) to authenticated;

create or replace function public.toggle_thread_lock(p_thread uuid)
returns void language plpgsql security invoker as $$
begin
  update public.threads
     set is_locked = not coalesce(is_locked, false)
   where id = p_thread;
end $$;
grant execute on function public.toggle_thread_lock(uuid) to authenticated;

-- Delete an entire thread
create or replace function public.delete_thread(p_thread uuid)
returns void language sql security invoker as $$
  delete from public.threads where id = p_thread;
$$;
grant execute on function public.delete_thread(uuid) to authenticated;

-- ========== POSTS: EDIT / DELETE FLAGGED ==========
-- Edit a post's content
create or replace function public.edit_post_text(p_post uuid, p_content text)
returns void language plpgsql security invoker as $$
begin
  update public.posts
     set content = p_content
   where id = p_post;
end $$;
grant execute on function public.edit_post_text(uuid, text) to authenticated;

-- Delete a post that has been flagged at least once
create or replace function public.delete_flagged_post(p_post uuid)
returns void language plpgsql security invoker as $$
begin
  delete from public.posts
   where id = p_post
     and exists (select 1 from public.flags f where f.post_id = p_post);
end $$;
grant execute on function public.delete_flagged_post(uuid) to authenticated;

-- ========== FLAGS: HOUSEKEEPING ==========
-- Delete an individual flag
create or replace function public.delete_flag(p_flag uuid)
returns void language sql security invoker as $$
  delete from public.flags where id = p_flag;
$$;
grant execute on function public.delete_flag(uuid) to authenticated;

-- Clear all flags for a given post
create or replace function public.clear_flags_for_post(p_post uuid)
returns void language sql security invoker as $$
  delete from public.flags where post_id = p_post;
$$;
grant execute on function public.clear_flags_for_post(uuid) to authenticated;

-- ========== MEMBERSHIP: ADMIN OVERRIDES ==========
-- Add a member to a nest as admin or owner
create or replace function public.admin_add_member(p_nest uuid, p_profile uuid)
returns void language plpgsql security invoker as $$
begin
  insert into public.nest_members (nest_id, profile_id)
  values (p_nest, p_profile)
  on conflict (nest_id, profile_id) do nothing;
end $$;
grant execute on function public.admin_add_member(uuid, uuid) to authenticated;

-- Remove a member from a nest as admin or owner
create or replace function public.admin_remove_member(p_nest uuid, p_profile uuid)
returns void language sql security invoker as $$
  delete from public.nest_members
   where nest_id = p_nest and profile_id = p_profile;
$$;
grant execute on function public.admin_remove_member(uuid, uuid) to authenticated;

-- ========== ROLES: ADMIN ONLY ==========
-- Wrap the existing set_user_role so client code only calls one name
create or replace function public.admin_set_user_role(p_target uuid, p_role text)
returns void language sql
security definer
set search_path = public as $$
  select public.set_user_role(p_target, p_role);
$$;
revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

-- ========== OPTIONAL: VIEW HELPERS ==========
-- List reported posts with flag counts
create or replace function public.list_reported_posts()
returns table (
  post_id uuid,
  thread_id uuid,
  nest_id uuid,
  flags_count integer,
  latest_flag timestamptz
) language sql stable security invoker as $$
  select
    p.id as post_id,
    p.thread_id,
    t.nest_id,
    count(f.id)::int as flags_count,
    max(f.created_at) as latest_flag
  from public.posts p
  join public.flags f on f.post_id = p.id
  join public.threads t on t.id = p.thread_id
  group by p.id, p.thread_id, t.nest_id
  order by latest_flag desc;
$$;
grant execute on function public.list_reported_posts() to authenticated;

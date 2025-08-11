-- Moderator and admin RPC functions

/* =========================================================
   Moderation helpers
========================================================= */
-- Return flagged posts for moderation dashboard
create or replace function public.get_moderation_queue()
returns table (
  flag_id uuid,
  post_id uuid,
  thread_id uuid,
  content text,
  reason text,
  reported_at timestamptz
) language sql
security invoker as $$
  select f.id, p.id, p.thread_id, p.content, f.reason, f.created_at
    from public.flags f
    join public.posts p on p.id = f.post_id;
$$;

-- Lock or unlock a thread directly
create or replace function public.lock_thread(p_thread uuid, p_locked boolean default true)
returns void language plpgsql
security invoker as $$
begin
  if not public.is_moderator() then
    raise exception 'Not authorized';
  end if;
  update public.threads
     set is_locked = p_locked
   where id = p_thread;
end $$;

-- Convenience wrappers
create or replace function public.unlock_thread(p_thread uuid)
returns void language sql
security invoker as $$
  update public.threads set is_locked = false where id = p_thread;
$$;

create or replace function public.toggle_thread_lock(p_thread uuid)
returns void language plpgsql
security invoker as $$
begin
  if not public.is_moderator() then
    raise exception 'Not authorized';
  end if;
  update public.threads
     set is_locked = not coalesce(is_locked, false)
   where id = p_thread;
end $$;

-- Delete an entire thread
create or replace function public.delete_thread(p_thread uuid)
returns void language sql
security invoker as $$
  delete from public.threads where id = p_thread;
$$;

/* =========================================================
   Post helpers
========================================================= */
-- Edit a post's content
create or replace function public.edit_post_text(p_post uuid, p_content text)
returns void language plpgsql
security invoker as $$
begin
  update public.posts
     set content = p_content
   where id = p_post;
end $$;

-- Delete a post that has been flagged
create or replace function public.delete_flagged_post(p_post uuid)
returns void language plpgsql
security invoker as $$
begin
  delete from public.posts
   where id = p_post
     and exists (select 1 from public.flags f where f.post_id = p_post);
end $$;

/* =========================================================
   Flag helpers
========================================================= */
-- Remove a single flag
create or replace function public.delete_flag(p_flag uuid)
returns void language sql
security invoker as $$
  delete from public.flags where id = p_flag;
$$;

-- Clear all flags for a given post
create or replace function public.clear_flags_for_post(p_post uuid)
returns void language sql
security invoker as $$
  delete from public.flags where post_id = p_post;
$$;

-- List posts with flag counts
create or replace function public.list_reported_posts()
returns table (
  post_id uuid,
  thread_id uuid,
  nest_id uuid,
  flags_count integer,
  latest_flag timestamptz
) language sql stable
security invoker as $$
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

/* =========================================================
   Membership helpers
========================================================= */
-- Add a member to a nest as admin or owner
create or replace function public.admin_add_member(p_nest uuid, p_profile uuid)
returns void language plpgsql
security invoker as $$
begin
  insert into public.nest_members (nest_id, profile_id)
  values (p_nest, p_profile)
  on conflict (nest_id, profile_id) do nothing;
end $$;

-- Remove a member from a nest as admin or owner
create or replace function public.admin_remove_member(p_nest uuid, p_profile uuid)
returns void language sql
security invoker as $$
  delete from public.nest_members
   where nest_id = p_nest and profile_id = p_profile;
$$;

/* =========================================================
   Admin helpers
========================================================= */
create or replace function public.admin_set_user_role(p_target uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can set roles';
  end if;
  if p_role not in ('user','moderator','admin') then
    raise exception 'Invalid role';
  end if;
  update public.profiles set role = p_role where id = p_target;
end $$;

/* =========================================================
   Grants
========================================================= */
revoke all on function public.get_moderation_queue() from public;
grant execute on function public.get_moderation_queue() to authenticated;

revoke all on function public.lock_thread(uuid, boolean) from public;
grant execute on function public.lock_thread(uuid, boolean) to authenticated;

revoke all on function public.unlock_thread(uuid) from public;
grant execute on function public.unlock_thread(uuid) to authenticated;

revoke all on function public.toggle_thread_lock(uuid) from public;
grant execute on function public.toggle_thread_lock(uuid) to authenticated;

revoke all on function public.delete_thread(uuid) from public;
grant execute on function public.delete_thread(uuid) to authenticated;

revoke all on function public.edit_post_text(uuid, text) from public;
grant execute on function public.edit_post_text(uuid, text) to authenticated;

revoke all on function public.delete_flagged_post(uuid) from public;
grant execute on function public.delete_flagged_post(uuid) to authenticated;

revoke all on function public.delete_flag(uuid) from public;
grant execute on function public.delete_flag(uuid) to authenticated;

revoke all on function public.clear_flags_for_post(uuid) from public;
grant execute on function public.clear_flags_for_post(uuid) to authenticated;

revoke all on function public.list_reported_posts() from public;
grant execute on function public.list_reported_posts() to authenticated;

revoke all on function public.admin_add_member(uuid, uuid) from public;
grant execute on function public.admin_add_member(uuid, uuid) to authenticated;

revoke all on function public.admin_remove_member(uuid, uuid) from public;
grant execute on function public.admin_remove_member(uuid, uuid) to authenticated;

revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

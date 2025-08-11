-- Moderator and admin RPC functions

/* =========================================================
   Moderation helpers
========================================================= */
create or replace function public.get_moderation_queue()
returns table(
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

create or replace function public.lock_thread(tid uuid)
returns void
language plpgsql
security invoker as $$
begin
  if not public.is_moderator() then
    raise exception 'Not authorized';
  end if;
  update public.threads set is_locked = true where id = tid;
end $$;

create or replace function public.unlock_thread(tid uuid)
returns void
language plpgsql
security invoker as $$
begin
  if not public.is_moderator() then
    raise exception 'Not authorized';
  end if;
  update public.threads set is_locked = false where id = tid;
end $$;

create or replace function public.resolve_flag(fid uuid)
returns void
language plpgsql
security invoker as $$
begin
  if not public.is_moderator() then
    raise exception 'Not authorized';
  end if;
  delete from public.flags where id = fid;
end $$;

/* =========================================================
   Admin helpers
========================================================= */
create or replace function public.admin_set_user_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can set roles';
  end if;
  if new_role not in ('user','moderator','admin') then
    raise exception 'Invalid role';
  end if;
  update public.profiles set role = new_role where id = target;
end $$;

grant execute on function public.get_moderation_queue() to authenticated;
grant execute on function public.lock_thread(uuid) to authenticated;
grant execute on function public.unlock_thread(uuid) to authenticated;
grant execute on function public.resolve_flag(uuid) to authenticated;
revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;


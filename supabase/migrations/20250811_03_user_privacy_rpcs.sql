-- User privacy RPC functions

/* =========================================================
   Export user data
========================================================= */
create or replace function public.export_user_data()
returns jsonb
language sql
security invoker as $$
  select jsonb_build_object(
    'profile', (select row_to_json(p) from public.profiles p where p.id = auth.uid()),
    'posts', coalesce((select jsonb_agg(row_to_json(po)) from public.posts po where po.author_id = auth.uid()), '[]'::jsonb),
    'reactions', coalesce((select jsonb_agg(row_to_json(r)) from public.reactions r where r.author_id = auth.uid()), '[]'::jsonb),
    'memberships', coalesce((select jsonb_agg(row_to_json(m)) from public.nest_members m where m.profile_id = auth.uid()), '[]'::jsonb)
  );
$$;

/* =========================================================
   Delete user account
========================================================= */
create or replace function public.delete_user_account()
returns void
language sql
security definer
set search_path = public, auth as $$
  delete from auth.users where id = auth.uid();
$$;

/* =========================================================
   Grants
========================================================= */
revoke all on function public.export_user_data() from public;
grant execute on function public.export_user_data() to authenticated;

revoke all on function public.delete_user_account() from public;
grant execute on function public.delete_user_account() to authenticated;

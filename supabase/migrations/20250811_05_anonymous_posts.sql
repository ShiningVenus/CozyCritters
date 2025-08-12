-- Add anonymous posting support
alter table public.posts
  add column is_anonymous boolean not null default false;

-- View masking author_id when anonymous
create or replace view public.posts_redacted as
select
  p.id,
  p.thread_id,
  case
    when p.is_anonymous and not (public.is_moderator() or p.author_id = auth.uid())
      then null
      else p.author_id
  end as author_id,
  p.content,
  p.created_at,
  p.updated_at,
  p.is_anonymous
from public.posts p;

-- Adjust privileges: use view for reads
revoke select on public.posts from anon, authenticated;
grant select on public.posts_redacted to anon, authenticated;

-- RPC to create an anonymous post with surrogate name
create or replace function public.create_anonymous_post(
  p_thread uuid,
  p_content text
) returns table (
  id uuid,
  thread_id uuid,
  content text,
  created_at timestamptz,
  surrogate_name text
) language plpgsql
security invoker as $$
declare
  v_post public.posts;
  v_name text;
begin
  v_name := 'anon-' || substr(md5(random()::text),1,8);
  insert into public.posts(thread_id, author_id, content, is_anonymous)
  values (p_thread, auth.uid(), p_content, true)
  returning * into v_post;
  return query select v_post.id, v_post.thread_id, v_post.content, v_post.created_at, v_name;
end;
$$;

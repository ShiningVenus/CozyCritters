-- Add expiration columns and cleanup job for posts and flags
alter table public.posts add column expires_at timestamptz;
alter table public.flags add column expires_at timestamptz;

update public.posts set expires_at = coalesce(created_at, now()) + interval '90 days' where expires_at is null;
update public.flags set expires_at = coalesce(created_at, now()) + interval '90 days' where expires_at is null;

alter table public.posts alter column expires_at set not null;
alter table public.posts alter column expires_at set default now() + interval '90 days';

alter table public.flags alter column expires_at set not null;
alter table public.flags alter column expires_at set default now() + interval '90 days';

create index if not exists posts_expires_at_idx on public.posts(expires_at);
create index if not exists flags_expires_at_idx on public.flags(expires_at);

create extension if not exists pg_cron;

create or replace function public.purge_expired_content()
returns void
language sql
security definer
as $$
  delete from public.flags where expires_at < now();
  delete from public.posts where expires_at < now();
$$;

select cron.schedule('purge_expired_content', '0 3 * * *', $$select public.purge_expired_content();$$)
where not exists (select 1 from cron.job where jobname = 'purge_expired_content');

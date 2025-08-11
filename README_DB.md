# CozyCritters Community PostgreSQL & Supabase Schema: Operations, Gotchas, Testing & Helpers

## Real-World Gotchas & Tips

- **Anon reads:** Public content for logged-out users only works if `anon` has USAGE on `public` and SELECT on the views/tables you intend to expose. We granted on `public_profiles`; do the same for any extra public views you add.

- **auth.uid() is null in SQL editor:** When you run queries in the Supabase SQL editor or psql, `auth.uid()` is null. Use the web API or the SQL editor’s “Run as user” to truly test RLS. Don’t debug RLS from psql and assume it matches app behavior.

- **Service role bypass:** Any admin job using the service key ignores RLS. Be careful with scripts and Edge Functions that run with the service key.

- **Realtime and RLS:** If you enable Realtime on a table, clients will only receive rows they can SELECT via RLS. If users aren’t seeing live updates, it’s usually a missing SELECT policy.

- **Foreign key cascades:** We use `on delete cascade`. Deleting a user from `auth.users` wipes their profile, memberships, posts, reactions, flags. That is intentional. If you want a softer delete, add `deleted_at` and adjust policies.

- **Username collisions:** `citext unique` prevents case variants. If you offer username change, handle “already taken” gracefully.

- **Migrations order:** Extensions, tables, grants, RLS, then triggers. If you reorder, grants and policies may fail.

- **Indexes vs. cost:** The indexes provided are safe. If write volume gets high, consider dropping least-used ones after checking `pg_stat_user_indexes`.

- **Future Storage:** If you later add file uploads, Storage has its own RLS. Plan a bucket per feature and mirror the nest visibility model there.

## Clean Apply Helper

Run this first when re-applying to a dirty DB. It drops conflicting policies and triggers without touching data.

```sql
-- Drop conflicting RLS policies safely (no-ops if missing)
do $$
delcare r record;
begin
  for r in
    select polname, schemaname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','nests','nest_members','threads','posts','reactions','flags')
  loop
    execute format('drop policy if exists %I on %I.%I', r.polname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Drop known triggers if they exist
drop trigger if exists set_threads_updated on threads;
drop trigger if exists set_posts_updated on posts;
drop trigger if exists on_auth_user_created on auth.users;
```

Then apply the full schema.

## 3-Minute Smoke Test

Run these in the SQL editor "Run as user" with a real user selected.

### Public read works
```sql
select * from nests where is_private = false limit 5;
```

### Owner can read private nest
```sql
-- Replace :owner with a real owner UUID
select * from nests where owner_id = auth.uid() and is_private = true;
```

### Member can’t read other private nest
```sql
-- Replace :other_private with a real private nest not joined by current user
select * from threads where nest_id = :other_private;  -- should return 0 rows
```

### Create thread in accessible nest
```sql
-- Replace :public_or_joined with a nest the user can access
insert into threads (nest_id, author_id, title)
values (:public_or_joined, auth.uid(), 'hello world')
returning id;
```

### Post in thread
```sql
insert into posts (thread_id, author_id, content)
values (:thread_id, auth.uid(), 'first post')
returning id, created_at, updated_at;
```

### Reaction uniqueness holds
```sql
insert into reactions (post_id, author_id, type) values (:post_id, auth.uid(), 'like');
-- Running the same line again should error on unique(post_id, author_id, type)
```

### Moderator can see flags
Run as a moderator user:
```sql
select * from flags limit 5;
```

## Schema Review & Security
- RLS-first, safe by default. All tables have explicit read/write policies before triggers.
- Public content available to anon and authenticated; private content only to members/owners/mods.
- Triggers and indexes for performance and auditing.
- See full schema in `cozycritters-schema.md`.

## Future: Storage, Soft Deletes, More
- If you add Storage, use RLS mirroring nest privacy.
- For soft deletes, add `deleted_at` fields and adjust RLS.
- For more moderation roles, expand the `role` check in `profiles` and adjust policies accordingly.

---

_Keep this file updated as your schema or policies evolve!_
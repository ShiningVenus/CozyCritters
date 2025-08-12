# Moderator and Admin Tools

Cozy Critter uses Supabase RPC calls for moderation features.
Below are common examples for Node.js clients.

## Moderator Powers

Moderators can manage threads and posts:

- Review queue
  ```ts
  await supabase.rpc('get_moderation_queue');
  ```
- Lock a thread
  ```ts
  await supabase.rpc('lock_thread', { p_thread: '<thread-id>', p_locked: true });
  ```
- Edit a post
  ```ts
  await supabase.rpc('edit_post_text', { p_post: '<post-id>', p_content: 'Updated text' });
  ```
- Clear flags on a post
  ```ts
  await supabase.rpc('clear_flags_for_post', { p_post: '<post-id>' });
  ```

## Admin Powers

Admins have moderator abilities plus membership and role control:

- Add a member
  ```ts
  await supabase.rpc('admin_add_member', { p_nest: '<nest-id>', p_profile: '<profile-id>' });
  ```
- Remove a member
  ```ts
  await supabase.rpc('admin_remove_member', { p_nest: '<nest-id>', p_profile: '<profile-id>' });
  ```
- Set a user's role
```ts
await supabase.rpc('admin_set_user_role', { p_target: '<user-id>', p_role: 'moderator' });
```

## Anonymous Posts

Users can publish posts without revealing their identity.
The `create_anonymous_post` RPC inserts a post with `is_anonymous` set and
returns a temporary surrogate name for display.
When a post is anonymous, non‑moderators see `author_id` as `null` via the
`posts_redacted` view, while moderators and the original author retain full
visibility.

```ts
await supabase.rpc('create_anonymous_post', {
  p_thread: '<thread-id>',
  p_content: 'Invisible critter here'
});
```

**Limitations**

- Surrogate names are not stored and cannot be regenerated.
- Direct table reads require moderator privileges to reveal authors.


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


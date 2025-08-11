
// Supabase v2 client helpers for Moderator/Admin actions
// Usage: import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_OR_SERVICE_KEY)

export type UUID = string;

export async function getModerationQueue(supabase: any) {
  return await supabase.rpc('get_moderation_queue');
}

// Threads
export async function lockThread(supabase: any, threadId: UUID) {
  return await supabase.rpc('lock_thread', { p_thread: threadId, p_locked: true });
}
export async function unlockThread(supabase: any, threadId: UUID) {
  return await supabase.rpc('unlock_thread', { p_thread: threadId });
}
export async function toggleThreadLock(supabase: any, threadId: UUID) {
  return await supabase.rpc('toggle_thread_lock', { p_thread: threadId });
}
export async function deleteThread(supabase: any, threadId: UUID) {
  return await supabase.rpc('delete_thread', { p_thread: threadId });
}

// Posts
export async function editPostText(supabase: any, postId: UUID, content: string) {
  return await supabase.rpc('edit_post_text', { p_post: postId, p_content: content });
}
export async function deleteFlaggedPost(supabase: any, postId: UUID) {
  return await supabase.rpc('delete_flagged_post', { p_post: postId });
}

// Flags
export async function deleteFlag(supabase: any, flagId: UUID) {
  return await supabase.rpc('delete_flag', { p_flag: flagId });
}
export async function clearFlagsForPost(supabase: any, postId: UUID) {
  return await supabase.rpc('clear_flags_for_post', { p_post: postId });
}
export async function listReportedPosts(supabase: any) {
  return await supabase.rpc('list_reported_posts');
}

// Membership (admin or owner per RLS)
export async function adminAddMember(supabase: any, nestId: UUID, profileId: UUID) {
  return await supabase.rpc('admin_add_member', { p_nest: nestId, p_profile: profileId });
}
export async function adminRemoveMember(supabase: any, nestId: UUID, profileId: UUID) {
  return await supabase.rpc('admin_remove_member', { p_nest: nestId, p_profile: profileId });
}

// Roles (admin only)
export async function adminSetUserRole(supabase: any, targetUserId: UUID, role: 'user' | 'moderator' | 'admin') {
  return await supabase.rpc('admin_set_user_role', { p_target: targetUserId, p_role: role });
}

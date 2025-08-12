// Supabase v2 client helpers for user privacy actions
// Usage: import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_OR_SERVICE_KEY)

export async function exportUserData(supabase: any) {
  return await supabase.rpc('export_user_data');
}

export async function deleteUserAccount(supabase: any) {
  return await supabase.rpc('delete_user_account');
}

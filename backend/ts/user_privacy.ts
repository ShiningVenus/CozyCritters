// Supabase v2 client helpers for user privacy actions
// Usage: import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_OR_SERVICE_KEY)

export async function exportUserData(supabase: any) {
  return await supabase.rpc('export_user_data');
}

export async function deleteUserAccount(supabase: any) {
  return await supabase.rpc('delete_user_account');
}

export async function setEncryptedEmail(
  supabase: any,
  email: string,
  key: string,
) {
  return await supabase.rpc('set_encrypted_email', {
    p_email: email,
    p_key: key,
  });
}

export async function getEncryptedEmail(supabase: any, key: string) {
  return await supabase.rpc('get_encrypted_email', {
    p_key: key,
  });
}

declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    rpc(fn: string, params?: Record<string, any>): Promise<any>;
  }
  export function createClient(url: string, key: string, opts?: any): SupabaseClient;
}

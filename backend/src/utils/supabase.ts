import { env } from "../env";

export const supabase = {
  from: (_table: string) => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
  }),
  rpc: async () => ({ data: null, error: null }),
  key: env.API_KEY,
};

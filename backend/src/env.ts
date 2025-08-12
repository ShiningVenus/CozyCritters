import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWKS_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Missing or invalid environment variables:");
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;

import { z } from 'zod';

const isProd = process.env.NODE_ENV === 'production';

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  PORT: z.coerce.number().int().default(4000),
  HTPASSWD_PATH: z.string().min(1)
});

export const env = envSchema.parse({
  JWT_SECRET: process.env.JWT_SECRET ?? (isProd ? undefined : 'dev-secret'),
  PORT: process.env.PORT,
  HTPASSWD_PATH: process.env.HTPASSWD_PATH ?? (isProd ? undefined : '.htpasswd')
});


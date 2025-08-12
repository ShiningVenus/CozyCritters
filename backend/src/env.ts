export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  PORT: Number(process.env.PORT || 4000),
  HTPASSWD_PATH: process.env.HTPASSWD_PATH || ".htpasswd"
};

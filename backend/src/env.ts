export const env = {
  API_KEY: process.env.API_KEY || "dev-key",
  PORT: Number(process.env.PORT || 4000),
  HTPASSWD_PATH: process.env.HTPASSWD_PATH || ".htpasswd"
};

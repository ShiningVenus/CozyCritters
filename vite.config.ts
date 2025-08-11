import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const onReplit = process.env.REPL_ID !== undefined;

export default defineConfig(async () => ({
  root: resolve(__dirname, "client"),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(!isProd && onReplit
      ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
      : []),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: "dist",        // relative to root => client/dist
    emptyOutDir: true,
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
}));


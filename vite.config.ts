import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const onReplit = process.env.REPL_ID !== undefined;

// Use VITE_BASE if provided, else "/"
const base = process.env.VITE_BASE && process.env.VITE_BASE.trim() !== ""
  ? process.env.VITE_BASE
  : "/";

export default defineConfig(async () => ({
  root: resolve(__dirname, "client"),
  base,                         // <- key line
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
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
}));



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const onReplit = process.env.REPL_ID !== undefined;

// 1) Highest priority: explicit override
let base = process.env.VITE_BASE?.trim();

// 2) Auto-detect GitHub Pages for THIS repo only
if (!base) {
  const inActions = process.env.GITHUB_ACTIONS === "true";
  const repo = (process.env.GITHUB_REPOSITORY || "").toLowerCase(); // e.g. "catgirlrika/cozycritters"
  if (inActions && repo === "catgirlrika/cozycritters") {
    base = "/CozyCritters/";
  }
}

// 3) Fallback for local dev and Netlify
if (!base) base = "/";

export default defineConfig(async () => ({
  root: resolve(__dirname, "client"),
  base, // <- this is the only knob you need now
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
    rollupOptions: {
      input: {
        main: resolve(__dirname, "client", "index.html"),
        forum: resolve(__dirname, "client", "forum.html"),
      },
    },
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
}));

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Framekit UI components import their shared helpers via the `@/` alias.
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist",
    // The bundle is dominated by lucide-react; raising the warning threshold
    // keeps the build output quiet now that the icons are properly imported.
    chunkSizeWarningLimit: 300,
  },
});
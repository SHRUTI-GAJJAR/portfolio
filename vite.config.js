import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // The bundle is dominated by lucide-react; raising the warning threshold
    // keeps the build output quiet now that the icons are properly imported.
    chunkSizeWarningLimit: 300,
  },
});
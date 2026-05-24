import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "./src/test-setup.js",
  },
});

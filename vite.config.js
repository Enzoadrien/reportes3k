import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000", // 👈 tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

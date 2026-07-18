import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/Scanning-Crypto-/',
  plugins: [
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: 'src/public',
  server: {
    port: 3000
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        favorites: resolve(__dirname, "favorites.html"),
        news: resolve(__dirname, "news/index.html"),
      },
    },
  },
});
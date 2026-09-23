/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };
import { imagetools } from "vite-imagetools";
import { VitePWA } from "vite-plugin-pwa";
import { changelogPlugin } from "./scripts/changelogPlugin";

export default defineConfig({
  base: "/poo-game/",
  define: { "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version) },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    imagetools(),
    changelogPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: { config: true, overrideManifestIcons: true },
      manifest: {
        name: "Poo Game",
        short_name: "Poo Game",
        description: "Push the emoji, collect them all.",
        theme_color: "#0b0814",
        background_color: "#0b0814",
        display: "standalone",
        orientation: "portrait",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,mp3}"],
        // Only the stage photo size a device actually loads gets cached, not every variant.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/main.tsx"],
    },
  },
});

import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * GitHub Pages has no SPA rewrites: a deep link like /poo-game/profiles would 404. Pages serves
 * `404.html` for unknown paths, so the build ships a copy of `index.html` under that name and
 * the router takes over. (Offline, the service worker's navigation fallback does the same.)
 */
export const spaFallbackPlugin = (): Plugin => {
  let outDir = "dist";
  return {
    name: "poo-game:spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
    },
  };
};

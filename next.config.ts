import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Páginas públicas saem do cache e são invalidadas por etiqueta quando o painel grava (ADR-0002).
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

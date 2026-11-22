import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const raizDoProjeto = fileURLToPath(new URL(".", import.meta.url));
// Containers do Testcontainers podem levar alguns segundos para subir.
const TEMPO_LIMITE_INTEGRACAO_MS = 120_000;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${raizDoProjeto}src`,
      "@tests": `${raizDoProjeto}tests`,
    },
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts", "tests/**/*.test.ts", "scripts/**/*.test.ts"],
          exclude: ["tests/integracao/**", "tests/e2e/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "componentes",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./tests/setup-componentes.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integracao",
          environment: "node",
          include: ["tests/integracao/**/*.test.ts"],
          testTimeout: TEMPO_LIMITE_INTEGRACAO_MS,
          hookTimeout: TEMPO_LIMITE_INTEGRACAO_MS,
        },
      },
    ],
  },
});

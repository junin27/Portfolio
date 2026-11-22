import { defineConfig, devices } from "@playwright/test";

// pnpm test:e2e roda só o Chromium (dia a dia); pnpm test:e2e:todos roda os três motores (CI e portão).
const PORTA_E2E = 3100;
const TEMPO_LIMITE_SERVIDOR_MS = 180_000;
const urlBase = `http://127.0.0.1:${PORTA_E2E}`;

const motores = [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  // Teste instável é falha (docs/estrategia-de-testes.md): nada de repetir até passar.
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "reports/playwright" }]],
  use: { baseURL: urlBase, trace: "retain-on-failure" },
  projects: motores,
  webServer: {
    command: `pnpm build && pnpm start --port ${PORTA_E2E}`,
    url: urlBase,
    reuseExistingServer: false,
    timeout: TEMPO_LIMITE_SERVIDOR_MS,
  },
});

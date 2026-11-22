import { defineConfig, devices } from "@playwright/test";

// No dia a dia roda só no Chromium; no CI e no portão (TODOS_OS_NAVEGADORES=1) roda nos três motores.
const todosOsNavegadores = process.env.CI === "true" || process.env.TODOS_OS_NAVEGADORES === "1";
const PORTA_E2E = 3100;
const TEMPO_LIMITE_SERVIDOR_MS = 180_000;
const urlBase = `http://127.0.0.1:${PORTA_E2E}`;

const chromium = { name: "chromium", use: { ...devices["Desktop Chrome"] } };
const outrosMotores = [
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
  projects: todosOsNavegadores ? [chromium, ...outrosMotores] : [chromium],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORTA_E2E}`,
    url: urlBase,
    reuseExistingServer: false,
    timeout: TEMPO_LIMITE_SERVIDOR_MS,
  },
});

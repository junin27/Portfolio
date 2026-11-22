import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("abre com o título do portfólio @smoke", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Portfólio");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Portfólio em construção");
  });
});

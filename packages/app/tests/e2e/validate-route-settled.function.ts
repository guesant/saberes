import { expect, type Page } from "@playwright/test";

export async function validateRouteSettled(page: Page): Promise<void> {
  await expect(page.locator("#root")).not.toBeEmpty();

  await expect.poll(
    async () => {
      return page.locator('[role="status"]')
        .evaluateAll((elements) => {
          return elements.filter((element) => {
            return /carregando/i.test(element.textContent || "");
          }).length;
        });
    },
    {
      intervals: [100, 250, 500, 1000],
      timeout: 8000,
      message: "a rota deve deixar o estado de carregamento e apresentar um estado terminal",
    },
  )
    .toBe(0);
}

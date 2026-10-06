import { expect, type Page } from "@playwright/test";

export async function validateNoDetails(page: Page): Promise<void> {
  await expect(page.locator("details, summary"))
    .toHaveCount(0);
}

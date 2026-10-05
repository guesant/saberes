import { expect, type Page } from "@playwright/test";

export async function validateVisibleControlsNamed(page: Page): Promise<void> {
  const controls = page.locator(
    'button:visible, a:visible, input:visible, textarea:visible, select:visible',
  );

  const count = await controls.count();

  const assertions = Array.from({ length: count }, (_, index) => {
    return expect(controls.nth(index))
      .toHaveAccessibleName(/.+/);
  });

  await Promise.all(assertions);
}

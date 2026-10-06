import { expect, type Page } from "@playwright/test";

export async function validateProgressiveDisclosure(page: Page): Promise<void> {
  await expect(page.getByRole("dialog"))
    .toHaveCount(0);

  const disclosures = page.locator("details");

  const disclosureCount = await disclosures.count();

  const verifyDisclosuresStartClosed = async (index: number): Promise<void> => {
    if (index >= disclosureCount) {return;}

    await expect(disclosures.nth(index)).not.toHaveAttribute("open", "");

    await verifyDisclosuresStartClosed(index + 1);
  };

  await verifyDisclosuresStartClosed(0);

  const openDisclosure = async (index: number): Promise<void> => {
    if (index >= disclosureCount) {return;}

    const disclosure = disclosures.nth(index);

    const visible = await disclosure.isVisible();

    if (visible) {
      const summary = disclosure.locator(":scope > summary");

      await expect(summary)
        .toBeVisible();

      await summary.click();

      await expect(disclosure)
        .toHaveAttribute("open", "");

      await expect(disclosure.locator(":scope > :not(summary)")
        .first())
        .toBeVisible();
    }

    await openDisclosure(index + 1);
  };

  await openDisclosure(0);

  const closeDisclosure = async (index: number): Promise<void> => {
    if (index < 0) {return;}

    const disclosure = disclosures.nth(index);

    if (await disclosure.evaluate((element) => { return (element as HTMLDetailsElement).open; })) {
      const summary = disclosure.locator(":scope > summary");

      await summary.click();

      await expect(disclosure)
        .not.toHaveAttribute("open", "");

      await expect(disclosure.locator(":scope > :not(summary)")
        .first())
        .toBeHidden();
    }

    await closeDisclosure(index - 1);
  };

  await closeDisclosure(disclosureCount - 1);
}

import { expect, type Page } from "@playwright/test";
import { validateLayoutClose } from "./validate-layout-close.function";

export async function validateDocumentOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });

  validateLayoutClose(
    overflow.documentWidth,
    overflow.viewportWidth,
    "the document must not overflow horizontally",
  );

  const unexpectedOverflow = await page.locator("[data-ui-layout]")
    .evaluateAll((elements) => {
      return elements
        .filter((element) => {
          const hasHorizontalOverflow = element.scrollWidth > element.clientWidth + 1;

          const hasDeclaration = element.hasAttribute("data-ui-overflow");

          return hasHorizontalOverflow && !hasDeclaration;
        })
        .map((element) => {
          return {
            className: element.className,
            id: element.id,
            tagName: element.tagName,
          };
        });
    });

  expect(unexpectedOverflow)
    .toEqual([]);
}

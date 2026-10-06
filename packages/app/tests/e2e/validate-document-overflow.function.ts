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

  const unexpectedOverflow = await page.locator("#main-content, #main-content *")
    .evaluateAll((elements) => {
      return elements
        .filter((element) => {
          const switchRoot = element.closest(".MuiSwitch-root");

          if (switchRoot && switchRoot !== element) {
            return false;
          }

          const hasHorizontalOverflow = element.scrollWidth > element.clientWidth + 3;

          const overflowMode = window.getComputedStyle(element).overflowX;

          let parent = element.parentElement;

          while (parent && parent.id !== "main-content") {
            const parentOverflowMode = window.getComputedStyle(parent).overflowX;

            if (["auto", "clip", "hidden", "scroll"].includes(parentOverflowMode)) {
              return false;
            }

            parent = parent.parentElement;
          }

          return hasHorizontalOverflow && !["auto", "clip", "hidden", "scroll"].includes(overflowMode);
        })
        .map((element) => {
          return {
            className: element.className,
            clientWidth: element.clientWidth,
            id: element.id,
            scrollWidth: element.scrollWidth,
            tagName: element.tagName,
            text: element.textContent?.trim()
              .slice(0, 80),
          };
        });
    });

  expect(unexpectedOverflow)
    .toEqual([]);
}

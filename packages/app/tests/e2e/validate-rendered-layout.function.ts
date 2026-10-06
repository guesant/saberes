import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function validateRenderedLayout(page: Page): Promise<void> {
  const findings = await page.locator("#main-content")
    .evaluate((main) => {
      const problems: string[] = [];

      Array.from(document.querySelectorAll<HTMLElement>("*"))
        .forEach((element) => {
          Array.from(element.attributes)
            .filter((attribute) => { return attribute.name.startsWith("data-ui-"); })
            .forEach((attribute) => {
              problems.push(`${element.tagName.toLowerCase()} renders forbidden ${attribute.name}`);
            });
        });

      const containers = [main, ...Array.from(main.querySelectorAll<HTMLElement>("*"))];

      containers.forEach((container) => {
        const style = window.getComputedStyle(container);

        const isVerticalLayout = style.display === "grid"
          ? style.gridTemplateColumns.trim()
            .split(/\s+/u).length === 1
          : style.display === "flex" && style.flexDirection === "column";

        if (!isVerticalLayout) {
          return;
        }

        const children = Array.from(container.children)
          .map((child) => {
            return child.getBoundingClientRect();
          })
          .filter((rect) => {
            return rect.width > 0 && rect.height > 0;
          })
          .sort((first, second) => {
            return first.top - second.top;
          });

        if (children.length < 2) {
          return;
        }

        const rowGap = Number.parseFloat(style.rowGap) || 0;

        children.slice(1)
          .forEach((child, index) => {
            const actualGap = child.top - children[index].bottom;

            if (actualGap < -1) {
              problems.push(`${container.tagName.toLowerCase()} has overlapping vertical children`);
            }

            if (container.tagName !== "DETAILS" && rowGap > 0 && actualGap < rowGap - 1) {
              problems.push(`${container.tagName.toLowerCase()} does not realize its computed row gap`);
            }
          });
      });

      return problems;
    });

  expect(findings)
    .toEqual([]);
}

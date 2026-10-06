import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function validateControlGeometry(page: Page): Promise<void> {
  const buttonGeometry = await page.locator(".MuiButton-root:visible:not([data-ui-control='choice'])")
    .evaluateAll((buttons) => {
      return buttons.map((button) => {
        const style = window.getComputedStyle(button);

        const label = button.querySelector("[data-ui-button-label]");

        let labelWhiteSpace = style.whiteSpace;

        let labelOverflow = "";

        if (label) {
          const labelStyle = window.getComputedStyle(label);

          labelWhiteSpace = labelStyle.whiteSpace;

          labelOverflow = labelStyle.textOverflow;
        }

        return {
          height: button.getBoundingClientRect().height,
          labelWhiteSpace,
          labelOverflow,
        };
      });
    });

  buttonGeometry.forEach((button) => {
    expect(button.height)
      .toBe(44);

    expect(button.labelWhiteSpace)
      .toBe("nowrap");

    expect(button.labelOverflow)
      .toBe("ellipsis");
  });

  const choiceGeometry = await page.locator(".MuiButton-root[data-ui-control='choice']:visible")
    .evaluateAll((choices) => {
      return choices.map((choice) => {
        const style = window.getComputedStyle(choice);

        return {
          height: choice.getBoundingClientRect().height,
          overflow: choice.scrollWidth > choice.clientWidth,
          whiteSpace: style.whiteSpace,
        };
      });
    });

  choiceGeometry.forEach((choice) => {
    expect(choice.height)
      .toBeGreaterThanOrEqual(44);

    expect(choice.overflow)
      .toBe(false);

    expect(choice.whiteSpace)
      .toBe("normal");
  });

  const tabGeometry = await page.locator(".MuiTab-root:visible")
    .evaluateAll((tabs) => {
      return tabs.map((tab) => {return {
        height: tab.getBoundingClientRect().height,
        whiteSpace: window.getComputedStyle(tab).whiteSpace,
      };});
    });

  tabGeometry.forEach((tab) => {
    expect(tab.whiteSpace)
      .toBe("nowrap");
  });

  if (tabGeometry.length > 1) {
    expect(Math.max(...tabGeometry.map((tab) => { return tab.height; }))
      - Math.min(...tabGeometry.map((tab) => { return tab.height; })))
      .toBeLessThanOrEqual(1);
  }

  const mainGeometry = await page.locator("#main-content")
    .evaluate((main) => {
      const rect = main.getBoundingClientRect();

      const style = window.getComputedStyle(main);

      const canvasStyle = window.getComputedStyle(main.parentElement as HTMLElement);

      return {
        background: style.backgroundColor,
        borderLeftStyle: style.borderLeftStyle,
        borderLeftWidth: Number.parseFloat(style.borderLeftWidth),
        borderRightStyle: style.borderRightStyle,
        borderRightWidth: Number.parseFloat(style.borderRightWidth),
        canvasBackground: canvasStyle.backgroundColor,
        centerOffset: Math.abs((rect.left + rect.right) / 2 - window.innerWidth / 2),
        width: rect.width,
      };
    });

  const viewport = page.viewportSize();

  if (viewport && viewport.width >= 900) {
    expect(mainGeometry.centerOffset)
      .toBeLessThanOrEqual(1);

    expect(mainGeometry.width)
      .toBeLessThanOrEqual(500);

    expect(mainGeometry.background)
      .not.toBe(mainGeometry.canvasBackground);

    expect([mainGeometry.borderLeftStyle, mainGeometry.borderRightStyle])
      .toEqual(["solid", "solid"]);

    expect([mainGeometry.borderLeftWidth, mainGeometry.borderRightWidth])
      .toEqual([1, 1]);
  }

  const cardGeometry = await page.locator(".MuiCard-root:visible")
    .evaluateAll((cards) => {
      return cards.map((card) => {
        const style = window.getComputedStyle(card);

        return {
          background: style.backgroundColor,
          borderStyle: style.borderTopStyle,
          borderWidth: Number.parseFloat(style.borderTopWidth),
        };
      });
    });

  cardGeometry.forEach((card) => {
    expect(card.borderStyle)
      .toBe("solid");

    expect(card.borderWidth)
      .toBe(1);

    expect(card.background)
      .not.toBe(mainGeometry.background);
  });
}

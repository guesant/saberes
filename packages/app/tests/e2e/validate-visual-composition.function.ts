import { expect, type Page } from "@playwright/test";
import type { VisualAuditScenario } from "./visual-audit-scenario.type";

export async function validateVisualComposition(
  page: Page,
  scenario: VisualAuditScenario,
): Promise<void> {
  const issues = await page.evaluate((scenarioName) => {
    const findings: string[] = [];

    const main = document.querySelector<HTMLElement>("#main-content");

    if (main && window.innerWidth >= 1440 && main.getBoundingClientRect().width > 1201) {
      findings.push(`${scenarioName}: main content needs a max-width container`);
    }

    if (document.body.textContent?.includes("conteúdo previamente revisado")) {
      findings.push(`${scenarioName}: stale footer copy is still being served`);
    }

    document.querySelectorAll<HTMLLabelElement>("label[for]")
      .forEach((label) => {
        if (label.classList.contains("MuiInputLabel-root")) {
          return;
        }

        const control = document.getElementById(label.htmlFor);

        if (!control) {
          return;
        }

        const labelBox = label.getBoundingClientRect();

        const controlBox = control.getBoundingClientRect();

        const left = Math.max(labelBox.left, controlBox.left);

        const right = Math.min(labelBox.right, controlBox.right);

        const top = Math.max(labelBox.top, controlBox.top);

        const bottom = Math.min(labelBox.bottom, controlBox.bottom);

        const intersectionArea = Math.max(0, right - left) * Math.max(0, bottom - top);

        const labelArea = labelBox.width * labelBox.height;

        if (labelArea > 0 && intersectionArea / labelArea > 0.5) {
          findings.push(`${scenarioName}: form label overlaps its control`);
        }
      });

    document.querySelectorAll<HTMLElement>("#main-content *")
      .forEach((layout) => {
        const style = window.getComputedStyle(layout);

        const isVertical = style.display === "grid"
          ? style.gridTemplateColumns.trim()
            .split(/\s+/u).length === 1
          : style.display === "flex" && style.flexDirection === "column";

        if (!isVertical) {
          return;
        }

        const children = Array.from(layout.children)
          .map((child) => {
            return child.getBoundingClientRect();
          })
          .filter((box) => {
            return box.width > 0 && box.height > 0;
          })
          .sort((first, second) => {
            return first.top - second.top;
          });

        children.slice(1)
          .forEach((child, index) => {
            const actualGap = child.top - children[index].bottom;

            if (actualGap < -1) {
              findings.push(`${scenarioName}: vertical siblings overlap`);
            }
          });
      });

    document.querySelectorAll<HTMLElement>("form")
      .forEach((form) => {
        const formBox = form.getBoundingClientRect();

        if (formBox.width < 600) {
          return;
        }

        form.querySelectorAll<HTMLButtonElement>("button")
          .forEach((button) => {
            const buttonBox = button.getBoundingClientRect();

            if (buttonBox.width > formBox.width * 0.85) {
              findings.push(`${scenarioName}: structural action is unnecessarily full-width`);
            }
          });
      });

    return findings;
  }, scenario.name);

  expect(issues, `${scenario.name} visual composition findings`)
    .toEqual([]);
}

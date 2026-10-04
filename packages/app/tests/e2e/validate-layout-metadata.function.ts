import { collectLayoutRows } from "./collect-layout-rows.function";
import { getLayoutBox } from "./get-layout-box.function";
import { validateLayoutClose } from "./validate-layout-close.function";
import { validateLayoutUniform } from "./validate-layout-uniform.function";
import type { Page } from "@playwright/test";

export async function validateLayoutMetadata(page: Page): Promise<void> {
  const layouts = await page.locator("[data-ui-layout]")
    .all();

  await Promise.all(
    layouts.map(async (layout) => {
      const metadata = await layout.evaluate((element) => {
        return {
          align: element.getAttribute("data-ui-align"),
          closure: element.getAttribute("data-ui-closure"),
          kind: element.getAttribute("data-ui-layout"),
        };
      });

      const container = await layout.evaluate(getLayoutBox);

      const children = await layout.locator(":scope > *")
        .evaluateAll((elements) => {
          return elements
            .map((element) => {
              const rect = element.getBoundingClientRect();

              return {
                bottom: rect.bottom,
                height: rect.height,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                width: rect.width,
              };
            })
            .filter((box) => {
              return box.width > 0 && box.height > 0;
            });
        });

      const rows = collectLayoutRows(children);

      rows.forEach((row) => {
        if (metadata.kind === "equal-grid") {
          validateLayoutUniform(
            row.map((box) => {
              return box.width;
            }),
            `${metadata.kind} must keep equivalent child widths uniform`,
          );

          validateLayoutUniform(
            row.slice(1)
              .map((box, index) => {
                return box.left - row[index].right;
              }),
            `${metadata.kind} must keep sibling gaps uniform`,
          );
        }

        if (metadata.kind === "row" || metadata.kind === "cluster") {
          validateLayoutUniform(
            row.slice(1)
              .map((box, index) => {
                return box.left - row[index].right;
              }),
            `${metadata.kind} must keep sibling gaps uniform`,
          );
        }
      });

      if (metadata.kind === "equal-grid" && metadata.closure === "closed" && rows.length > 1) {
        rows.slice(0, -1)
          .forEach((row) => {
            validateLayoutClose(
              row[0].left,
              container.left,
              "closed rows must start at the container edge",
            );

            validateLayoutClose(
              row.at(-1)?.right ?? container.right,
              container.right,
              "closed rows must finish at the container edge",
            );
          });
      }

      if (metadata.kind === "split" || metadata.align === "start") {
        validateLayoutUniform(
          rows[0]?.map((box) => {
            return box.top;
          }) ?? [],
          `${metadata.kind} children must align at the top`,
        );
      }
    }),
  );
}

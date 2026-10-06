import { collectLayoutRows } from "./collect-layout-rows.function";
import { getLayoutBox } from "./get-layout-box.function";
import { validateActionGroupAlignment } from "./validate-action-group-alignment.function";
import { validateLayoutAlignment } from "./validate-layout-alignment.function";
import { validateLayoutClose } from "./validate-layout-close.function";
import { validateLayoutGap } from "./validate-layout-gap.function";
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
          display: window.getComputedStyle(element).display,
          gap: element.getAttribute("data-ui-gap"),
          kind: element.getAttribute("data-ui-layout"),
          actions: element.getAttribute("data-ui-actions") === "true",
          debugName: `${element.tagName.toLowerCase()}.${String(element.className)
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .join(".")}`,
          viewportWidth: window.innerWidth,
        };
      });

      const gapMeasurement = await layout.evaluate((element) => {
        const style = window.getComputedStyle(element);

        return {
          columnGap: Number.parseFloat(style.columnGap) || 0,
          rowGap: Number.parseFloat(style.rowGap) || 0,
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

      const actionChildren = metadata.actions
        ? await layout.locator(":scope > button, :scope > a, :scope > label")
          .evaluateAll((elements) => {
            return elements
              .map((element) => {
                const rect = element.getBoundingClientRect();

                return {
                  bottom: rect.bottom,
                  height: rect.height,
                  left: rect.left,
                  right: rect.right,
                  textAlign: window.getComputedStyle(element).textAlign,
                  top: rect.top,
                  width: rect.width,
                };
              })
              .filter((box) => {
                return box.width > 0 && box.height > 0;
              });
          })
        : [];

      const rows = collectLayoutRows(children);

      const gapRequiredLayouts = ["cluster", "equal-grid", "row", "split", "stack"];

      const hasLayoutChildren = children.length > 1;

      if (metadata.kind && gapRequiredLayouts.includes(metadata.kind) && hasLayoutChildren && !metadata.gap) {
        throw new Error(`${metadata.kind} layout (${metadata.debugName}) must declare a gap token`);
      }

      if (metadata.kind && gapRequiredLayouts.includes(metadata.kind) && hasLayoutChildren && !["flex", "grid", "inline-flex", "inline-grid"].includes(metadata.display)) {
        throw new Error(`${metadata.kind} layout (${metadata.debugName}) with multiple children must use flex or grid`);
      }

      if (metadata.gap && metadata.kind && hasLayoutChildren) {
        validateLayoutGap(gapMeasurement, {
          layout: metadata.kind,
          token: metadata.gap,
          viewportWidth: metadata.viewportWidth,
        });
      }

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

      if (metadata.align) {
        rows.forEach((row) => {
          validateLayoutAlignment(row, metadata.align ?? "", `${metadata.kind} children`);
        });
      }

      if (metadata.actions && metadata.kind === "row") {
        validateActionGroupAlignment(actionChildren, container);
      }

      if (metadata.kind === "bottom-tabs") {
        const bottomTabsChildren = rows.flat();

        validateLayoutUniform(
          bottomTabsChildren.map((box) => {
            return box.width;
          }),
          "bottom tabs must use uniform action widths",
        );

        validateLayoutUniform(
          bottomTabsChildren.map((box) => {
            return box.height;
          }),
          "bottom tabs must use uniform action heights",
        );

        validateLayoutClose(
          bottomTabsChildren[0]?.left ?? container.left,
          container.left,
          "bottom tabs must start at the container edge",
        );

        validateLayoutClose(
          bottomTabsChildren.at(-1)?.right ?? container.right,
          container.right,
          "bottom tabs must finish at the container edge",
        );
      }
    }),
  );
}

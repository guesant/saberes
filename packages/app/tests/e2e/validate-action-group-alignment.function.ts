import { expect } from "@playwright/test";
import { validateLayoutClose } from "./validate-layout-close.function";
import { validateLayoutUniform } from "./validate-layout-uniform.function";
import type { ActionGroupBox } from "./action-group-box.interface";
import type { LayoutIntegrityBox } from "./layout-integrity-box.type";

export function validateActionGroupAlignment(
  children: ActionGroupBox[],
  container: LayoutIntegrityBox,
): void {
  if (children.length < 2) {
    return;
  }

  const row = [...children]
    .sort((first, second) => {
      return first.left - second.left;
    });

  validateLayoutClose(
    row[0].left,
    container.left,
    `action groups must start at the container edge: container=${container.left}, first=${row[0].left}, row=${JSON.stringify(row)}`,
  );

  const gaps = row.slice(1)
    .map((box, index) => {
      return box.left - row[index].right;
    });

  validateLayoutUniform(
    gaps,
    `action groups must keep horizontal sibling gaps uniform: gaps=${JSON.stringify(gaps)}, row=${JSON.stringify(row)}`,
  );

  expect(new Set(children.map((child) => {return child.textAlign;})).size)
    .toBe(1);
}

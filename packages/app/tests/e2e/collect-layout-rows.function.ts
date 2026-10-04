import { layoutTolerance } from "./layout-integrity.test-support";
import type { LayoutIntegrityBox } from "./layout-integrity-box.type";

export function collectLayoutRows(boxes: LayoutIntegrityBox[]): LayoutIntegrityBox[][] {
  const rows: LayoutIntegrityBox[][] = [];

  [...boxes]
    .sort((first, second) => {
      return first.top - second.top || first.left - second.left;
    })
    .forEach((box) => {
      const row = rows.find((candidate) => {
        return Math.abs(candidate[0].top - box.top) <= layoutTolerance;
      });

      if (row) {
        row.push(box);

        return;
      }

      rows.push([box]);
    });

  return rows.map((row) => {
    return row.sort((first, second) => {
      return first.left - second.left;
    });
  });
}

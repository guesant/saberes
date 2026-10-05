import { validateLayoutUniform } from "./validate-layout-uniform.function";
import type { LayoutIntegrityBox } from "./layout-integrity-box.type";

export function validateLayoutAlignment(
  boxes: LayoutIntegrityBox[],
  alignment: string,
  label: string,
): void {
  const values = boxes.map((box) => {
    if (alignment === "end") {
      return box.bottom;
    }

    if (alignment === "center") {
      return box.top + box.height / 2;
    }

    return box.top;
  });

  validateLayoutUniform(values, `${label} must keep ${alignment} alignment uniform`);
}

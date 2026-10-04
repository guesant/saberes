import type { LayoutIntegrityBox } from "./layout-integrity-box.type";

export function getLayoutBox(element: Element): LayoutIntegrityBox {
  const rect = element.getBoundingClientRect();

  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  };
}

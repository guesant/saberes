import { createElement } from "react";
import type { ComponentType, ReactElement } from "react";

export function createIconElement(component: ComponentType): ReactElement {
  return createElement(component);
}

import type { UIBoxProps } from "./ui-box-props.type";
import type { ElementType } from "react";

export function getUiBoxNativeProps<Component extends ElementType>(props: UIBoxProps<Component>) {
  const nativeProps = { ...props };

  delete nativeProps.align;

  delete nativeProps.children;

  delete nativeProps.columns;

  delete nativeProps.component;

  delete nativeProps.gap;

  delete nativeProps.inset;

  delete nativeProps.sx;

  delete nativeProps.layout;

  delete nativeProps.minItemWidth;

  delete nativeProps.wrap;

  return nativeProps;
}

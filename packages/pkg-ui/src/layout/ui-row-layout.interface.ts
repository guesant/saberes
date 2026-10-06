import type { UIRowProps } from "./ui-row-props.interface";

export interface UiRowLayout {
  align: NonNullable<UIRowProps["align"]>;
  alignItems: "center" | "flex-end" | "flex-start" | "stretch";
  children: UIRowProps["children"];
  gap: NonNullable<UIRowProps["gap"]>;
  inset: NonNullable<UIRowProps["inset"]>;
  layout: "cluster" | "row";
  wrap: boolean;
}

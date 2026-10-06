import type { UILayoutProps } from "./ui-layout-props.interface";

export interface UIRowProps extends UILayoutProps {
  align?: "center" | "end" | "start" | "stretch";
  wrap?: boolean;
}

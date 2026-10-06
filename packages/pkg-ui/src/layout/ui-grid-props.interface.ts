import type { UILayoutProps } from "./ui-layout-props.interface";

export interface UIGridProps extends UILayoutProps {
    columns?: 2;
    minItemWidth?: "compact" | "comfortable";
}

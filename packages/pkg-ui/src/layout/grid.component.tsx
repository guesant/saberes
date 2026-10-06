import { UIBox } from "../box.component";
import type { UIGridProps } from "./ui-grid-props.interface";
import type { ReactElement } from "react";

export function UIGrid(props: UIGridProps): ReactElement {
  const {
    children,
    columns,
    gap = "md",
    inset = "none",
    minItemWidth = "comfortable",
    ...boxProps
  } = props;

  return (
    <UIBox
      {...boxProps}
      align="stretch"
      columns={columns}
      gap={gap}
      inset={inset}
      layout="grid"
      minItemWidth={minItemWidth}
    >
      {children}
    </UIBox>
  );
}

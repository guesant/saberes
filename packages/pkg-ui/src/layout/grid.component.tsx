import { UIBox } from "../box.component";
import type { UIGridProps } from "./ui-grid-props.interface";
import type { ReactElement } from "react";

export function UIGrid(props: UIGridProps): ReactElement {
  const { children, columns, component = "div", gap = "md", inset = "none", minItemWidth = "comfortable" } = props;

  return (
    <UIBox
      align="stretch"
      component={component}
      columns={columns}
      data-ui-align="stretch"
      data-ui-closure="closed"
      data-ui-gap={gap}
      data-ui-inset={inset}
      data-ui-layout="equal-grid"
      gap={gap}
      inset={inset}
      layout="grid"
      minItemWidth={minItemWidth}
    >
      {children}
    </UIBox>
  );
}

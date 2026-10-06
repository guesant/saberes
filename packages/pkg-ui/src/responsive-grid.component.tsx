import { UIBox } from "./box.component";
import type { UIResponsiveGridProps } from "./responsive-grid-props.interface";
import type { ReactElement } from "react";

export function UIResponsiveGrid(props: UIResponsiveGridProps): ReactElement {
  return (
    <UIBox
      align="stretch"
      gap="md"
      inset="none"
      layout="grid"
      sx={{
        "& > *": {
          maxWidth: "100%",
          minWidth: 0,
          overflowWrap: "anywhere",
        },
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </UIBox>
  );
}

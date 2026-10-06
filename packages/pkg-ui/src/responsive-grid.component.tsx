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
        gridTemplateColumns: { md: "repeat(2, minmax(0, 1fr))", xs: "minmax(0, 1fr)" },
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </UIBox>
  );
}

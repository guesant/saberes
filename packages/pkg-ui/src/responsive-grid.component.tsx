import { Box as MuiBox } from "@mui/material";
import type { UIResponsiveGridProps } from "./responsive-grid-props.interface";
import type { ReactElement } from "react";

export function UIResponsiveGrid(props: UIResponsiveGridProps): ReactElement {
  return (
    <MuiBox
      alignItems="stretch"
      data-ui-align="stretch"
      data-ui-closure="closed"
      data-ui-gap="md"
      data-ui-layout="equal-grid"
      display="grid"
      gap={2}
      minWidth={0}
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
    </MuiBox>
  );
}

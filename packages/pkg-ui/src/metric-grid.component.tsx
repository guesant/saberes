import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridProps = {
  children: ReactNode;
};

export function UIMetricGrid(props: UIMetricGridProps): ReactElement {
  return (
    <MuiGrid
      container
      data-ui-closure="closed"
      data-ui-gap="md"
      data-ui-layout="equal-grid"
      spacing={2}
    >
      {props.children}
    </MuiGrid>
  );
}

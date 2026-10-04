import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridProps = {
  children: ReactNode;
};

export function UIMetricGrid(props: UIMetricGridProps): ReactElement {
  return (
    <MuiGrid container spacing={2}>
      {props.children}
    </MuiGrid>
  );
}

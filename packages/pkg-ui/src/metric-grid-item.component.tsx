import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridItemProps = {
  children: ReactNode;
};

export function UIMetricGridItem(props: UIMetricGridItemProps): ReactElement {
  return (
    <MuiGrid
      data-ui-layout="layout-item"
      size={{ md: 4, xs: 12 }}
      sx={{ display: "flex", minWidth: 0, "& > *": { flex: 1 } }}
    >
      {props.children}
    </MuiGrid>
  );
}

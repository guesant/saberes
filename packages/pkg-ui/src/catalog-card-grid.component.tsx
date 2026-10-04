import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridProps = {
  children: ReactNode;
};

export function UICatalogCardGrid(props: UICatalogCardGridProps): ReactElement {
  return (
    <MuiGrid
      container
      data-ui-closure="closed"
      data-ui-gap="md"
      data-ui-layout="equal-grid"
      minWidth={0}
      spacing={2}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiGrid>
  );
}

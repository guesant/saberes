import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridProps = {
  children: ReactNode;
};

export function UICatalogCardGrid(props: UICatalogCardGridProps): ReactElement {
  return (
    <MuiGrid container spacing={2}>
      {props.children}
    </MuiGrid>
  );
}

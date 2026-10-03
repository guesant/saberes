import { Grid as MuiGrid, type GridProps as MuiGridProps } from "@mui/material";
import type { ReactElement } from "react";

export type GridProps = MuiGridProps;

export function Grid(props: GridProps): ReactElement {
  return <MuiGrid {...props} />;
}

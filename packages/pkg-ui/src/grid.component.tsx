import { Grid as MuiGrid, type GridProps as MuiGridProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIGridProps = MuiGridProps;

export function UIGrid(props: UIGridProps): ReactElement {
  return <MuiGrid {...props} />;
}

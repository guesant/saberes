import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridItemProps = {
  children: ReactNode;
};

export function UIMetricGridItem(props: UIMetricGridItemProps): ReactElement {
  return <MuiGrid size={{ md: 4, xs: 12 }}>{props.children}</MuiGrid>;
}

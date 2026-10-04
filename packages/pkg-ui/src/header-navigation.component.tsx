import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIHeaderNavigationProps = {
  children: ReactNode;
};

export function UIHeaderNavigation(props: UIHeaderNavigationProps): ReactElement {
  return <MuiBox sx={{ display: { md: "flex", xs: "none" }, gap: 1 }}>{props.children}</MuiBox>;
}

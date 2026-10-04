import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIPageSurfaceProps = {
  children: ReactNode;
};

export function UIPageSurface(props: UIPageSurfaceProps): ReactElement {
  return <MuiBox sx={{ minHeight: "100vh" }}>{props.children}</MuiBox>;
}

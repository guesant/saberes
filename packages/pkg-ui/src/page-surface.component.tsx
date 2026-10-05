import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIPageSurfaceProps = {
  children: ReactNode;
};

export function UIPageSurface(props: UIPageSurfaceProps): ReactElement {
  return <MuiBox data-ui-layout="stack" sx={{ minHeight: "100vh" }}>{props.children}</MuiBox>;
}

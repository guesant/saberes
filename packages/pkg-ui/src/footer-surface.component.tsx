import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIFooterSurfaceProps = {
  children: ReactNode;
};

export function UIFooterSurface(props: UIFooterSurfaceProps): ReactElement {
  return (
    <MuiBox component="footer" data-ui-inset="xl" data-ui-layout="stack" sx={{ color: "text.secondary", py: 4, textAlign: "center" }}>
      {props.children}
    </MuiBox>
  );
}

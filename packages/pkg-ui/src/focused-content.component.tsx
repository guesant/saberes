import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export interface UIFocusedContentProps {
  children: ReactNode;
}

export function UIFocusedContent(props: UIFocusedContentProps): ReactElement {
  return (
    <MuiBox data-ui-layout="stack" sx={{ display: "grid", justifyItems: "center", minWidth: 0, width: "100%" }}>
      <MuiBox data-ui-layout="stack" sx={{ maxWidth: "56rem", minWidth: 0, width: "100%" }}>
        {props.children}
      </MuiBox>
    </MuiBox>
  );
}

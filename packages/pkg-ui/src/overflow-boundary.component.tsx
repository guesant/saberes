import { Box as MuiBox } from "@mui/material";
import type { UIOverflowBoundaryProps } from "./overflow-boundary-props.type";
import type { ReactElement } from "react";

export function UIOverflowBoundary(props: UIOverflowBoundaryProps): ReactElement {
  const overflow = props.mode === "scroll-x" ? { overflowX: "auto" } : undefined;

  const verticalOverflow = props.mode === "scroll-y" ? { overflowY: "auto" } : undefined;

  const clipOverflow = props.mode === "clip" ? { overflow: "hidden" } : undefined;

  return (
    <MuiBox
      data-ui-overflow={props.mode}
      sx={{ ...overflow, ...verticalOverflow, ...clipOverflow }}
    >
      {props.children}
    </MuiBox>
  );
}

import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export interface UIDiscoveryGridProps {
  children: ReactNode;
  label: string;
}

export function UIDiscoveryGrid(props: UIDiscoveryGridProps): ReactElement {
  return (
    <MuiBox
      aria-label={props.label}
      component="nav"
      data-ui-gap="md"
      data-ui-layout="equal-grid"
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" } }}
    >
      {props.children}
    </MuiBox>
  );
}

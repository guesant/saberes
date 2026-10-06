import { Paper as MuiPaper } from "@mui/material";
import { getContentSurfaceConfig } from "./get-content-surface-config.function";
import type { UIContentSurfaceProps } from "./content-surface-props.interface";
import type { ReactElement } from "react";

export function UIContentSurface(props: UIContentSurfaceProps): ReactElement {
  const config = getContentSurfaceConfig(props.mode);

  return (
    <MuiPaper
      aria-label={props.ariaLabel}
      component={props.component ?? "div"}
      data-ui-inset="md"
      data-ui-layout="layout-item"
      data-ui-outset="lg"
      data-ui-overflow="scroll-x"
      sx={{
        bgcolor: config.backgroundColor,
        overflowX: config.overflowX,
        p: config.padding,
      }}
      variant={config.variant}
    >
      {props.children}
    </MuiPaper>
  );
}

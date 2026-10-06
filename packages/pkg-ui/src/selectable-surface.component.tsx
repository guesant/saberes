import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from "@mui/material";
import type { ReactElement } from "react";

export interface UISelectableSurfaceProps extends MuiPaperProps {
  interactive?: boolean;
  disabled?: boolean;
  selected: boolean;
}

export function UISelectableSurface(props: UISelectableSurfaceProps): ReactElement {
  const { disabled, interactive = false, selected, sx, ...paperProps } = props;

  return (
    <MuiPaper
      {...paperProps}
      component={interactive ? "button" : "div"}
      disabled={disabled}
      data-ui-inset="md"
      data-ui-layout="stack"
      sx={{
        borderColor: selected ? "primary.main" : undefined,
        borderWidth: 1,
        boxShadow: "none",
        outline: "none",
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
        p: { md: 2, xs: 1.5 },
        ...(interactive ? { textAlign: "left", width: "100%" } : {}),
        ...sx,
      }}
    />
  );
}

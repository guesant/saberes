import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from "@mui/material";
import type { ReactElement } from "react";

export interface UISelectableSurfaceProps extends MuiPaperProps {
  interactive?: boolean;
  selected: boolean;
}

export function UISelectableSurface(props: UISelectableSurfaceProps): ReactElement {
  const { interactive = false, selected, sx, ...paperProps } = props;

  return (
    <MuiPaper
      {...paperProps}
      component={interactive ? "button" : "div"}
      sx={{
        borderColor: selected ? "primary.main" : undefined,
        ...(interactive ? { textAlign: "left", width: "100%" } : {}),
        ...sx,
      }}
    />
  );
}

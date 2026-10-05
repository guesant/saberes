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
      data-ui-inset="md"
      data-ui-layout="stack"
      sx={{
        borderColor: selected ? "primary.main" : undefined,
        p: { md: 2, xs: 1.5 },
        ...(interactive ? { textAlign: "left", width: "100%" } : {}),
        ...sx,
      }}
    />
  );
}

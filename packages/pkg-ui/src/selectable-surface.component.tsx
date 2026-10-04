import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from "@mui/material";
import type { ReactElement } from "react";

export type UISelectableSurfaceProps = MuiPaperProps & {
  selected: boolean;
};

export function UISelectableSurface(props: UISelectableSurfaceProps): ReactElement {
  const { selected, sx, ...paperProps } = props;

  return (
    <MuiPaper {...paperProps} sx={{ borderColor: selected ? "primary.main" : undefined, ...sx }} />
  );
}

import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIAccentIconProps = {
  children: ReactNode;
};

export function UIAccentIcon(props: UIAccentIconProps): ReactElement {
  return <MuiBox color="primary.main">{props.children}</MuiBox>;
}

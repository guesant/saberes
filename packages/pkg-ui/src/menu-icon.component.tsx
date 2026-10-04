import MuiMenuIcon from "@mui/icons-material/Menu";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type UIMenuIconProps = SvgIconProps;

export function UIMenuIcon(props: UIMenuIconProps): ReactElement {
  return <MuiMenuIcon {...props} />;
}

import MuiMenuIcon from "@mui/icons-material/Menu";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactElement } from "react";

export type MenuIconProps = SvgIconProps;

export function MenuIcon(props: MenuIconProps): ReactElement {
  return <MuiMenuIcon {...props} />;
}

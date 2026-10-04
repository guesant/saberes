import {
  ListItemIcon as MuiListItemIcon,
  type ListItemIconProps as MuiListItemIconProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIListItemIconProps = MuiListItemIconProps;

export function UIListItemIcon(props: UIListItemIconProps): ReactElement {
  return <MuiListItemIcon {...props} />;
}

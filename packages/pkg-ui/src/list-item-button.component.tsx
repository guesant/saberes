import {
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIListItemButtonProps = MuiListItemButtonProps & {
  href?: string;
  to?: string;
};

export function UIListItemButton(props: UIListItemButtonProps): ReactElement {
  return <MuiListItemButton {...(props as MuiListItemButtonProps)} />;
}

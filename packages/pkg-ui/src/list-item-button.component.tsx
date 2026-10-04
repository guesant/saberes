import {
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UIListItemButtonProps extends MuiListItemButtonProps {
  href?: string;
  to?: string;
}

export function UIListItemButton(props: UIListItemButtonProps): ReactElement {
  return (
    <MuiListItem disablePadding>
      <MuiListItemButton {...(props as MuiListItemButtonProps)} />
    </MuiListItem>
  );
}

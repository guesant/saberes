import {
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UIListItemButtonProps extends MuiListItemButtonProps {
  divider?: boolean;
  href?: string;
  to?: string;
}

export function UIListItemButton(props: UIListItemButtonProps): ReactElement {
  const { divider = false, ...buttonProps } = props;

  return (
    <MuiListItem divider={divider} disablePadding>
      <MuiListItemButton {...(buttonProps as MuiListItemButtonProps)} />
    </MuiListItem>
  );
}

import {
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type ListItemButtonProps = MuiListItemButtonProps & {
  href?: string;
  to?: string;
};

export function ListItemButton(props: ListItemButtonProps): ReactElement {
  return <MuiListItemButton {...(props as MuiListItemButtonProps)} />;
}

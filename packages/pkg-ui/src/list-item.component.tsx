import { ListItem as MuiListItem, type ListItemProps as MuiListItemProps } from "@mui/material";
import type { ReactElement } from "react";

export type ListItemProps = MuiListItemProps;

export function ListItem(props: ListItemProps): ReactElement {
  return <MuiListItem {...props} />;
}

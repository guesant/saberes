import { ListItem as MuiListItem, type ListItemProps as MuiListItemProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIListItemProps = MuiListItemProps;

export function UIListItem(props: UIListItemProps): ReactElement {
  return <MuiListItem {...props} />;
}

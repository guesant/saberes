import {
  ListItemText as MuiListItemText,
  type ListItemTextProps as MuiListItemTextProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type ListItemTextProps = MuiListItemTextProps;

export function ListItemText(props: ListItemTextProps): ReactElement {
  return <MuiListItemText {...props} />;
}

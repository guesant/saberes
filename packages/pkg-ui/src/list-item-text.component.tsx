import {
  ListItemText as MuiListItemText,
  type ListItemTextProps as MuiListItemTextProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIListItemTextProps = MuiListItemTextProps;

export function UIListItemText(props: UIListItemTextProps): ReactElement {
  return <MuiListItemText {...props} />;
}

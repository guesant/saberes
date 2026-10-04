import { List as MuiList, type ListProps as MuiListProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIListProps = MuiListProps;

export function UIList(props: UIListProps): ReactElement {
  return <MuiList {...props} />;
}

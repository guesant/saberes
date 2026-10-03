import { List as MuiList, type ListProps as MuiListProps } from "@mui/material";
import type { ReactElement } from "react";

export type ListProps = MuiListProps;

export function List(props: ListProps): ReactElement {
  return <MuiList {...props} />;
}

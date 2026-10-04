import { Table as MuiTable, type TableProps as MuiTableProps } from "@mui/material";
import type { ReactElement } from "react";

export type UITableProps = MuiTableProps;

export function UITable(props: UITableProps): ReactElement {
  return <MuiTable {...props} />;
}

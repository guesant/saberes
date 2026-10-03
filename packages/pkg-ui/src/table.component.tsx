import { Table as MuiTable, type TableProps as MuiTableProps } from "@mui/material";
import type { ReactElement } from "react";

export type TableProps = MuiTableProps;

export function Table(props: TableProps): ReactElement {
  return <MuiTable {...props} />;
}

import { Table as MuiTable } from "@mui/material";
import { UIOverflowBoundary } from "./overflow-boundary.component";
import type { UIContentTableProps } from "./content-table-props.interface";
import type { ReactElement } from "react";

export function UIContentTable(props: UIContentTableProps): ReactElement {
  return (
    <UIOverflowBoundary mode="scroll-x">
      <MuiTable sx={{ width: "100%", borderCollapse: "collapse" }}>{props.children}</MuiTable>
    </UIOverflowBoundary>
  );
}

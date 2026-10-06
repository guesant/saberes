import { UIBox } from "./box.component";
import { UIOverflowBoundary } from "./overflow-boundary.component";
import type { UIContentTableProps } from "./content-table-props.interface";
import type { ReactElement } from "react";

export function UIContentTable(props: UIContentTableProps): ReactElement {
  return (
    <UIOverflowBoundary mode="scroll-x">
      <UIBox component="table" inset="none" layout="native" sx={{ width: "100%", borderCollapse: "collapse" }}>
        {props.children}
      </UIBox>
    </UIOverflowBoundary>
  );
}

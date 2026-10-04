import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UISplitContentRowProps = {
  children: ReactNode;
};

export function UISplitContentRow(props: UISplitContentRowProps): ReactElement {
  return (
    <MuiStack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
      {props.children}
    </MuiStack>
  );
}

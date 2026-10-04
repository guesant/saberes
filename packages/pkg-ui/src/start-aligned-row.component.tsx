import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIStartAlignedRowProps = {
  children: ReactNode;
};

export function UIStartAlignedRow(props: UIStartAlignedRowProps): ReactElement {
  return (
    <MuiStack alignItems="flex-start" direction="row" spacing={2}>
      {props.children}
    </MuiStack>
  );
}

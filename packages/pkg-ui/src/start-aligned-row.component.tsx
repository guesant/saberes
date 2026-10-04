import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIStartAlignedRowProps = {
  children: ReactNode;
};

export function UIStartAlignedRow(props: UIStartAlignedRowProps): ReactElement {
  return (
    <MuiStack
      alignItems="flex-start"
      direction={{ sm: "row", xs: "column" }}
      minWidth={0}
      spacing={2}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiStack>
  );
}

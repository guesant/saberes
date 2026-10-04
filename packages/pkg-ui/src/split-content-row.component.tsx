import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UISplitContentRowProps = {
  children: ReactNode;
};

export function UISplitContentRow(props: UISplitContentRowProps): ReactElement {
  return (
    <MuiStack
      alignItems="flex-start"
      direction={{ sm: "row", xs: "column" }}
      justifyContent="space-between"
      minWidth={0}
      spacing={2}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiStack>
  );
}

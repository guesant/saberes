import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIInlineActionsProps = {
  children: ReactNode;
  wrap?: boolean;
};

export function UIInlineActions(props: UIInlineActionsProps): ReactElement {
  return (
    <MuiStack
      alignItems="center"
      direction="row"
      flexWrap={props.wrap ? "wrap" : "nowrap"}
      spacing={1}
    >
      {props.children}
    </MuiStack>
  );
}

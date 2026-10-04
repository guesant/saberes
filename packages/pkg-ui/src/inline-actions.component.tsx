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
      data-ui-gap="sm"
      data-ui-layout={props.wrap ? "cluster" : "row"}
      direction="row"
      flexWrap={props.wrap ? "wrap" : "nowrap"}
      minWidth={0}
      spacing={1}
      sx={{ maxWidth: "100%" }}
    >
      {props.children}
    </MuiStack>
  );
}

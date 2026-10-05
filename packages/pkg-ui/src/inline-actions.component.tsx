import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIInlineActionsProps = {
  children: ReactNode;
  wrap?: boolean;
};

export function UIInlineActions(props: UIInlineActionsProps): ReactElement {
  return (
    <MuiBox
      alignItems="center"
      data-ui-align="center"
      data-ui-actions="true"
      data-ui-gap="sm"
      data-ui-layout={props.wrap ? "cluster" : "row"}
      display="flex"
      flexWrap={props.wrap ? "wrap" : "nowrap"}
      gap={1}
      flexDirection="row"
      minWidth={0}
      sx={{ maxWidth: "100%" }}
    >
      {props.children}
    </MuiBox>
  );
}

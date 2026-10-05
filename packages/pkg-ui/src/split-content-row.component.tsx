import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UISplitContentRowProps = {
  children: ReactNode;
};

export function UISplitContentRow(props: UISplitContentRowProps): ReactElement {
  return (
    <MuiBox
      alignItems="flex-start"
      data-ui-align="start"
      data-ui-gap="md"
      data-ui-layout="split"
      display="flex"
      flexDirection={{ sm: "row", xs: "column" }}
      gap={2}
      justifyContent="space-between"
      minWidth={0}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiBox>
  );
}

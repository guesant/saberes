import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIStartAlignedRowProps = {
  children: ReactNode;
};

export function UIStartAlignedRow(props: UIStartAlignedRowProps): ReactElement {
  return (
    <MuiBox
      alignItems="flex-start"
      data-ui-align="start"
      data-ui-gap="md"
      data-ui-layout="stack"
      display="flex"
      flexDirection={{ sm: "row", xs: "column" }}
      gap={2}
      minWidth={0}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiBox>
  );
}

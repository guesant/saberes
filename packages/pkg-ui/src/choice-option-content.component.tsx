import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export interface UIChoiceOptionContentProps {
  children: ReactNode;
  marker: ReactNode;
}

export function UIChoiceOptionContent(props: UIChoiceOptionContentProps): ReactElement {
  return (
    <MuiBox
      alignItems="flex-start"
      data-ui-align="start"
      data-ui-gap="sm"
      data-ui-layout="row"
      display="flex"
      gap={1}
      minWidth={0}
      sx={{ "& > :last-child": { flex: 1, minWidth: 0, overflowWrap: "anywhere" } }}
      width="100%"
    >
      {props.marker}
      {props.children}
    </MuiBox>
  );
}

import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export interface UIPreferenceRowProps {
  children: ReactNode;
  control: ReactNode;
}

export function UIPreferenceRow(props: UIPreferenceRowProps): ReactElement {
  return (
    <MuiBox
      data-ui-gap="md"
      data-ui-inset="md"
      data-ui-layout="split"
      data-ui-align="center"
      display="grid"
      gap={2}
      gridTemplateColumns={{ sm: "minmax(0, 1fr) auto", xs: "1fr" }}
      alignItems="center"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        minHeight: 72,
        py: 2,
        width: "100%",
      }}
    >
      {props.children}
      {props.control}
    </MuiBox>
  );
}

import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIResponsiveFieldsProps = {
  children: ReactNode;
};

export function UIResponsiveFields(props: UIResponsiveFieldsProps): ReactElement {
  return (
    <MuiBox
      data-ui-gap="sm"
      data-ui-layout="stack"
      display="flex"
      flexDirection={{ md: "row", xs: "column" }}
      gap={1}
      minWidth={0}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiBox>
  );
}

import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIResponsiveFieldsProps = {
  children: ReactNode;
};

export function UIResponsiveFields(props: UIResponsiveFieldsProps): ReactElement {
  return (
    <MuiStack
      direction={{ md: "row", xs: "column" }}
      minWidth={0}
      spacing={1}
      sx={{ maxWidth: "100%", width: "100%" }}
    >
      {props.children}
    </MuiStack>
  );
}

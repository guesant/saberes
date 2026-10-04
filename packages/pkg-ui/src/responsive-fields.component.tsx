import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIResponsiveFieldsProps = {
  children: ReactNode;
};

export function UIResponsiveFields(props: UIResponsiveFieldsProps): ReactElement {
  return (
    <MuiStack direction={{ md: "row", xs: "column" }} spacing={1}>
      {props.children}
    </MuiStack>
  );
}

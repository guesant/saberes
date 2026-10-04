import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UITwoColumnLayoutProps = {
  primary: ReactNode;
  secondary: ReactNode;
};

export function UITwoColumnLayout(props: UITwoColumnLayoutProps): ReactElement {
  return (
    <MuiGrid container data-ui-align="start" data-ui-gap="lg" data-ui-layout="split" spacing={3}>
      <MuiGrid size={{ md: 8, xs: 12 }}>{props.primary}</MuiGrid>
      <MuiGrid size={{ md: 4, xs: 12 }}>{props.secondary}</MuiGrid>
    </MuiGrid>
  );
}

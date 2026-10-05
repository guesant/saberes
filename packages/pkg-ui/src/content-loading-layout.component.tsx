import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIContentLoadingLayoutProps = {
  children: ReactNode;
};

export function UIContentLoadingLayout(props: UIContentLoadingLayoutProps): ReactElement {
  return (
    <MuiBox
      alignItems="center"
      aria-live="polite"
      data-ui-align="center"
      data-ui-inset="xl"
      data-ui-layout="stack"
      display="flex"
      flexDirection="column"
      role="status"
      sx={{ py: 4 }}
    >
      {props.children}
    </MuiBox>
  );
}

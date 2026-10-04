import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIContentLoadingLayoutProps = {
  children: ReactNode;
};

export function UIContentLoadingLayout(props: UIContentLoadingLayoutProps): ReactElement {
  return (
    <MuiStack alignItems="center" role="status" aria-live="polite" sx={{ py: 10 }}>
      {props.children}
    </MuiStack>
  );
}

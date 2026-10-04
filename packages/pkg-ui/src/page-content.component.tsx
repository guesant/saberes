import { Container as MuiContainer } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIPageContentProps = {
  children: ReactNode;
};

export function UIPageContent(props: UIPageContentProps): ReactElement {
  return (
    <MuiContainer maxWidth="lg" sx={{ py: { md: 5, xs: 3 } }}>
      {props.children}
    </MuiContainer>
  );
}

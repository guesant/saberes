import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIContentLoadingLayoutProps = {
  children: ReactNode;
};

export function UIContentLoadingLayout(props: UIContentLoadingLayoutProps): ReactElement {
  return (
    <UIBox
      align="center"
      aria-live="polite"
      gap="md"
      inset="xl"
      layout="column"
      role="status"
      sx={{ py: 4 }}
    >
      {props.children}
    </UIBox>
  );
}

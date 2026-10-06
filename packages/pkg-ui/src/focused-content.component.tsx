import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIFocusedContentProps {
  children: ReactNode;
}

export function UIFocusedContent(props: UIFocusedContentProps): ReactElement {
  return (
    <UIBox inset="none" layout="column" sx={{ justifyItems: "center" }}>
      <UIBox gap="md" inset="none" layout="column" sx={{ maxWidth: "56rem" }}>
        {props.children}
      </UIBox>
    </UIBox>
  );
}

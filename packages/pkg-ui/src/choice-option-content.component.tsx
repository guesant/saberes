import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIChoiceOptionContentProps {
  children: ReactNode;
  marker: ReactNode;
}

export function UIChoiceOptionContent(props: UIChoiceOptionContentProps): ReactElement {
  return (
    <UIBox
      align="start"
      gap="sm"
      inset="none"
      layout="row"
      sx={{ "& > :last-child": { flex: 1, minWidth: 0, overflowWrap: "anywhere" } }}
    >
      {props.marker}
      {props.children}
    </UIBox>
  );
}

import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UISplitContentRowProps = {
  children: ReactNode;
};

export function UISplitContentRow(props: UISplitContentRowProps): ReactElement {
  return (
    <UIBox
      align="start"
      gap="md"
      inset="none"
      layout="row"
      sx={{ flexDirection: { sm: "row", xs: "column" }, justifyContent: "space-between", maxWidth: "100%" }}
    >
      {props.children}
    </UIBox>
  );
}

import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIStartAlignedRowProps = {
  children: ReactNode;
};

export function UIStartAlignedRow(props: UIStartAlignedRowProps): ReactElement {
  return (
    <UIBox
      align="start"
      gap="md"
      inset="none"
      layout="row"
      sx={{ flexDirection: { sm: "row", xs: "column" }, maxWidth: "100%" }}
    >
      {props.children}
    </UIBox>
  );
}

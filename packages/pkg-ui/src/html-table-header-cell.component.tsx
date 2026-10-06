import { UIBox } from "./box.component";
import type { ReactNode } from "react";

export type UIHtmlTableHeaderCellProps = {
  children: ReactNode;
};

export function UIHtmlTableHeaderCell(props: UIHtmlTableHeaderCellProps) {
  return <UIBox component="th" inset="none" layout="native" scope="col">{props.children}</UIBox>;
}

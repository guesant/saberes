import { UIBox } from "./box.component";
import type { ReactNode } from "react";

export type UIHtmlTableCellProps = {
  children: ReactNode;
};

export function UIHtmlTableCell(props: UIHtmlTableCellProps) {
  return <UIBox component="td" inset="none" layout="native">{props.children}</UIBox>;
}

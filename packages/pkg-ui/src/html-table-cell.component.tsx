import type { ReactNode } from "react";

export type UIHtmlTableCellProps = {
  children: ReactNode;
};

export function UIHtmlTableCell(props: UIHtmlTableCellProps) {
  return <td>{props.children}</td>;
}

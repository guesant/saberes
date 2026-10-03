import type { ReactNode } from "react";

export type HtmlTableCellProps = {
  children: ReactNode;
};

export function HtmlTableCell(props: HtmlTableCellProps) {
  return <td>{props.children}</td>;
}

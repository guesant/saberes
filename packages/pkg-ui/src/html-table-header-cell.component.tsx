import type { ReactNode } from "react";

export type HtmlTableHeaderCellProps = {
  children: ReactNode;
};

export function HtmlTableHeaderCell(props: HtmlTableHeaderCellProps) {
  return <th scope="col">{props.children}</th>;
}

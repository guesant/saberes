import type { ReactNode } from "react";

export type UIHtmlTableHeaderCellProps = {
  children: ReactNode;
};

export function UIHtmlTableHeaderCell(props: UIHtmlTableHeaderCellProps) {
  return <th scope="col">{props.children}</th>;
}

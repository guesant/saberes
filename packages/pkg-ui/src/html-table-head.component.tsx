import type { ReactNode } from "react";

export type UIHtmlTableHeadProps = {
  children: ReactNode;
};

export function UIHtmlTableHead(props: UIHtmlTableHeadProps) {
  return <thead>{props.children}</thead>;
}

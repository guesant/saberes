import type { ReactNode } from "react";

export type HtmlTableHeadProps = {
  children: ReactNode;
};

export function HtmlTableHead(props: HtmlTableHeadProps) {
  return <thead>{props.children}</thead>;
}

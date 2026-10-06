import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIHeaderNavigationProps = {
  children: ReactNode;
};

export function UIHeaderNavigation(props: UIHeaderNavigationProps): ReactElement {
  return <UIBox gap="sm" inset="none" layout="row" sx={{ display: { md: "flex", xs: "none" } }}>{props.children}</UIBox>;
}

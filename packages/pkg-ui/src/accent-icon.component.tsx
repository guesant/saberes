import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIAccentIconProps = {
  children: ReactNode;
};

export function UIAccentIcon(props: UIAccentIconProps): ReactElement {
  return <UIBox component="span" inset="none" layout="flow" sx={{ color: "primary.main", display: "inline-flex" }}>{props.children}</UIBox>;
}

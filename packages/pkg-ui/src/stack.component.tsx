import { UIBox } from "./box.component";
import type { UILayoutProps } from "./layout/ui-layout-props.interface";
import type { ReactElement } from "react";

export type UIStackProps = UILayoutProps;

export function UIStack(props: UIStackProps): ReactElement {
  return <UIBox {...props} inset={props.inset ?? "none"} layout="column" />;
}

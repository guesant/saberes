import { UIBox } from "../box.component";
import type { UIRowProps } from "./ui-row-props.interface";
import type { ReactElement } from "react";

export type UIClusterProps = UIRowProps;

export function UICluster(props: UIClusterProps): ReactElement {
  const align = props.align ?? "center";

  const gap = props.gap ?? "sm";

  const inset = props.inset ?? "none";

  const component = props.component ?? "div";

  return (
    <UIBox
      align={align}
      component={component}
      data-ui-align={align}
      data-ui-gap={gap}
      data-ui-inset={inset}
      data-ui-layout="cluster"
      gap={gap}
      inset={inset}
      layout="row"
      wrap
    >
      {props.children}
    </UIBox>
  );
}

import { UIBox } from "../box.component";
import type { UIRowProps } from "./ui-row-props.interface";
import type { ReactElement } from "react";

export type UIClusterProps = UIRowProps;

export function UICluster(props: UIClusterProps): ReactElement {
  const align = props.align ?? "center";

  const gap = props.gap ?? "sm";

  const inset = props.inset ?? "none";

  return (
    <UIBox
      align={align}
      gap={gap}
      inset={inset}
      layout="row"
      wrap
    >
      {props.children}
    </UIBox>
  );
}

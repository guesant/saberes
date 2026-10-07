import { UIBox } from "./box.component";
import type { UIStackedActionsProps } from "./stacked-actions-props.interface";
import type { ReactElement } from "react";

export function UIStackedActions(props: UIStackedActionsProps): ReactElement {
  return (
    <UIBox align="stretch" gap="sm" inset="none" layout="column">
      {props.content}
    </UIBox>
  );
}

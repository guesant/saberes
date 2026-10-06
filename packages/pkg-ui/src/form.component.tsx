import { UIBox } from "./box.component";
import type { UIFormProps } from "./form-props.interface";
import type { ReactElement } from "react";

export function UIForm(props: UIFormProps): ReactElement {
  return (
    <UIBox
      align="start"
      component="form"
      gap="md"
      id={props.id}
      inset="none"
      layout="column"
      onSubmit={props.onSubmit}
    >
      {props.children}
    </UIBox>
  );
}

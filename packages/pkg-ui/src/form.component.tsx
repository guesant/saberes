import type { UIFormProps } from "./form-props.interface";
import type { ReactElement } from "react";

export function UIForm(props: UIFormProps): ReactElement {
  return <form onSubmit={props.onSubmit}>{props.children}</form>;
}

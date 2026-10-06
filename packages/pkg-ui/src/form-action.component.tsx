import { UIButton } from "./button.component";
import type { UIButtonProps } from "./button.component";
import type { ReactElement } from "react";

export type UIFormActionProps = UIButtonProps;

export function UIFormAction(props: UIFormActionProps): ReactElement {
  return (
    <UIButton
      {...props}
      sx={{ alignSelf: "flex-start", width: { sm: "auto", xs: "100%" }, ...props.sx }}
    />
  );
}

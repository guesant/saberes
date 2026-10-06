import { UIButton } from "./button.component";
import type { UIButtonProps } from "./button.component";
import type { ReactElement } from "react";

export type UIStartAlignedButtonProps = UIButtonProps;

export function UIStartAlignedButton(props: UIStartAlignedButtonProps): ReactElement {
  return (
    <UIButton {...props} sx={{ alignSelf: "flex-start", ...props.sx }} />
  );
}

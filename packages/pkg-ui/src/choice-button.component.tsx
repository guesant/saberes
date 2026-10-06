import { UIButton } from "./button.component";
import type { UIButtonProps } from "./button.component";
import type { ReactElement } from "react";

export type UIChoiceButtonProps = Omit<UIButtonProps, "iconOnly">;

export function UIChoiceButton(props: UIChoiceButtonProps): ReactElement {
  return <UIButton {...props} iconOnly={false} />;
}

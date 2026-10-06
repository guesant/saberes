import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UIIconButtonProps extends MuiIconButtonProps {
  shape?: "round" | "square";
  "aria-label": string;
}

export function UIIconButton(props: UIIconButtonProps): ReactElement {
  const { shape = "square", ...buttonProps } = props;

  return (
    <MuiIconButton
      {...buttonProps}
      className={`${props.className ?? ""} UIIconButton-shape-${shape}${props["aria-pressed"] !== undefined ? " UIIconButton-toggle" : ""}`.trim()}
      title={props["aria-label"]}
    />
  );
}

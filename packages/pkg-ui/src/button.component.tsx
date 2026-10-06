import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import { UIButtonActionIcon } from "./button-action-icon.component";
import { getButtonActionIconName } from "./get-button-action-icon-name.function";
import { getButtonPresentation } from "./get-button-presentation.function";
import type { ReactElement } from "react";

export interface UIButtonProps extends MuiButtonProps {
  href?: string;
  iconOnly?: boolean;
  iconShape?: "round" | "square";
  rel?: string;
  target?: string;
  to?: string;
}

export function UIButton(props: UIButtonProps): ReactElement {
  const presentation = getButtonPresentation(props);

  const muiProps = { ...props };

  delete muiProps.iconOnly;

  delete muiProps.iconShape;

  const toggleClass = props["aria-pressed"] !== undefined ? " UIButton-toggle" : "";

  const iconOnlyClass = presentation.iconShape ? ` UIButton-iconOnly UIButton-iconOnly-${presentation.iconShape}` : "";

  return (
    <MuiButton
      {...(muiProps as MuiButtonProps)}
      aria-label={presentation.ariaLabel}
      className={`${props.className ?? ""}${toggleClass}${iconOnlyClass}`.trim()}
      startIcon={props.startIcon ?? (
        <UIButtonActionIcon
          name={getButtonActionIconName(`${presentation.accessibleLabel} ${presentation.label}`)}
          pressed={props["aria-pressed"] === true}
        />
      )}
      title={presentation.title}
    >
      <span className="UIButton-label">{props.children}</span>
    </MuiButton>
  );
}

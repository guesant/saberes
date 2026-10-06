import { UIButton } from "./button.component";
import type { UISectionNavigationLinkProps } from "./section-navigation-link-props.interface";
import type { MouseEvent, ReactElement } from "react";

export function UISectionNavigationLink(props: UISectionNavigationLinkProps): ReactElement {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    props.onNavigate(props.item.id);
  };

  return (
    <UIButton
      aria-current={props.active ? "location" : undefined}
      href={`#${props.item.id}`}
      iconOnly={false}
      onClick={handleClick}
      sx={{ width: "100%" }}
      variant={props.active ? "contained" : "outlined"}
    >
      {props.item.label}
    </UIButton>
  );
}

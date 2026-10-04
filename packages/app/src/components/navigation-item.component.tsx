import { UIListItemButton, UIListItemIcon, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { ReactElement } from "react";

export type NavigationItemProps = {
  icon: ReactElement;
  label: string;
  onSelect(): void;
  selected: boolean;
  to: string;
};

export function NavigationItem(props: NavigationItemProps) {
  return (
    <UIListItemButton
      component={Link}
      onClick={props.onSelect}
      selected={props.selected}
      to={props.to}
    >
      <UIListItemIcon>{props.icon}</UIListItemIcon>
      <UIListItemText primary={props.label} />
    </UIListItemButton>
  );
}

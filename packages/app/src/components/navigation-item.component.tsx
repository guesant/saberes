import { UIListItemButton, UIListItemIcon, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { ReactElement } from "react";

export type NavigationItemProps = {
  icon: ReactElement;
  label: string;
  selected: boolean;
  to: string;
  onNavigate(): void;
};

export function NavigationItem(props: NavigationItemProps) {
  return (
    <UIListItemButton component={Link} onClick={props.onNavigate} selected={props.selected} to={props.to}>
      <UIListItemIcon>{props.icon}</UIListItemIcon>
      <UIListItemText primary={props.label} />
    </UIListItemButton>
  );
}

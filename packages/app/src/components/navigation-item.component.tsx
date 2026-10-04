import { UIListItem, UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";

export type NavigationItemProps = {
  label: string;
  onSelect: () => void;
  selected: boolean;
  to: string;
};

export function NavigationItem(props: NavigationItemProps) {
  return (
    <UIListItem disablePadding>
      <UIListItemButton
        component={Link}
        onClick={props.onSelect}
        selected={props.selected}
        to={props.to}
      >
        <UIListItemText primary={props.label} />
      </UIListItemButton>
    </UIListItem>
  );
}

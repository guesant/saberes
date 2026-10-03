import { ListItem, ListItemButton, ListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";

export type NavigationItemProps = {
  label: string;
  onSelect: () => void;
  selected: boolean;
  to: string;
};

export function NavigationItem(props: NavigationItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        onClick={props.onSelect}
        selected={props.selected}
        to={props.to}
      >
        <ListItemText primary={props.label} />
      </ListItemButton>
    </ListItem>
  );
}

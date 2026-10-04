import { UIList } from "@guesant/saberes-ui";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./navigation-item.component";

export type NavigationDrawerProps = {
  links: Array<{ label: string; to: string }>;
  onSelect: () => void;
};

export function NavigationDrawer(props: NavigationDrawerProps) {
  const location = useLocation();

  return (
    <UIList>
      {props.links.map((link) => (
        <NavigationItem
          key={link.to}
          label={link.label}
          onSelect={props.onSelect}
          selected={link.to !== "/" && location.pathname.startsWith(link.to)}
          to={link.to}
        />
      ))}
    </UIList>
  );
}

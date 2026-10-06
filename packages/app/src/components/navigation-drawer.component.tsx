import { UIList } from "@guesant/saberes-ui";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./navigation-item.component";
import type { NavigationLink } from "./navigation-link.interface";

export type NavigationDrawerProps = {
  links: NavigationLink[];
  onNavigate(): void;
};

export function NavigationDrawer(props: NavigationDrawerProps) {
  const location = useLocation();

  return (
    <UIList>
      {props.links.map((link) => {
        return (
          <NavigationItem
            icon={link.icon}
            key={link.to}
            label={link.label}
            onNavigate={props.onNavigate}
            selected={link.to !== "/" && location.pathname.startsWith(link.to)}
            to={link.to}
          />
        );
      })}
    </UIList>
  );
}

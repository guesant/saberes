import { UIList, UIToolbar } from "@guesant/saberes-ui";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./navigation-item.component";
import type { NavigationLink } from "./navigation-link.interface";

export type NavigationDrawerProps = {
  links: NavigationLink[];
  onSelect(): void;
};

export function NavigationDrawer(props: NavigationDrawerProps) {
  const location = useLocation();

  return (
    <>
      <UIToolbar />
      <UIList>
        {props.links.map((link) => (
          <NavigationItem
            icon={link.icon}
            key={link.to}
            label={link.label}
            onSelect={props.onSelect}
            selected={link.to !== "/" && location.pathname.startsWith(link.to)}
            to={link.to}
          />
        ))}
      </UIList>
    </>
  );
}

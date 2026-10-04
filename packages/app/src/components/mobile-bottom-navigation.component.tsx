import { UIBottomNavigation, UIBottomNavigationAction } from "@guesant/saberes-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { getMobileNavigationLinks } from "./get-mobile-navigation-links.function";
import type { NavigationLink } from "./navigation-link.interface";

export type MobileBottomNavigationProps = {
  links: NavigationLink[];
};

export function MobileBottomNavigation(props: MobileBottomNavigationProps) {
  const location = useLocation();

  const navigate = useNavigate();

  const links = getMobileNavigationLinks(props.links);

  const currentPath = location.pathname === "/" ? "/meu-estudo" : location.pathname;

  const selectedLink = links.find((link) => {
    return currentPath === link.to || currentPath.startsWith(`${link.to}/`);
  });

  return (
    <UIBottomNavigation
      onChange={(_, value) => {
        return navigate(value);
      }}
      value={selectedLink?.to || false}
    >
      {links.map((link) => {
        return (
          <UIBottomNavigationAction
            icon={link.icon}
            key={link.to}
            label={link.label}
            value={link.to}
          />
        );
      })}
    </UIBottomNavigation>
  );
}

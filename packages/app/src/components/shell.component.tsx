import {
  UIResponsiveNavigationDrawer,
  UIPageContent,
  UIPageSurface,
  type CommandPaletteEntry,
} from "@guesant/saberes-ui";
import { useNavigate } from "react-router-dom";
import { Footer } from "./footer.component";
import { MobileBottomNavigation } from "./mobile-bottom-navigation.component";
import { NavigationDrawer } from "./navigation-drawer.component";
import { NavigationHeader } from "./navigation-header.component";
import { ShellCommandPalette } from "./shell-command-palette.component";
import { useCommandPalette } from "./use-command-palette.hook";
import { useShellNavigation } from "./use-shell-navigation.hook";
import type { ReactNode } from "react";

export type ShellProps = {
  children: ReactNode;
};

export function Shell(props: ShellProps) {
  const navigate = useNavigate();

  const commandPalette = useCommandPalette();

  const { commandPaletteItems, links } = useShellNavigation();

  const handleCommandPaletteSelect = (item: CommandPaletteEntry): void => {
    commandPalette.close();

    navigate(item.value);
  };

  return (
    <UIPageSurface>
      <NavigationHeader onOpenCommandPalette={commandPalette.openPalette} />

      <ShellCommandPalette
        items={commandPaletteItems}
        onClose={commandPalette.close}
        onQueryChange={commandPalette.setQuery}
        onSelect={handleCommandPaletteSelect}
        open={commandPalette.open}
        query={commandPalette.query}
      />

      <UIResponsiveNavigationDrawer>
        <NavigationDrawer links={links} />
      </UIResponsiveNavigationDrawer>

      <UIPageContent sidebarAware>{props.children}</UIPageContent>

      <MobileBottomNavigation links={links} />

      <Footer />
    </UIPageSurface>
  );
}

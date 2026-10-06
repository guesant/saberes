import {
  UINavigationDrawer,
  UIPageContent,
  UIPageSurface,
  type CommandPaletteEntry,
} from "@guesant/saberes-ui";
import { useNavigate } from "react-router-dom";
import { NavigationDrawer } from "./navigation-drawer.component";
import { NavigationHeader } from "./navigation-header.component";
import { ShellCommandPalette } from "./shell-command-palette.component";
import { useCommandPalette } from "./use-command-palette.hook";
import { useNavigationDrawer } from "./use-navigation-drawer.hook";
import { useShellNavigation } from "./use-shell-navigation.hook";
import type { ReactNode } from "react";

export type ShellProps = {
  children: ReactNode;
};

export function Shell(props: ShellProps) {
  const navigate = useNavigate();

  const commandPalette = useCommandPalette();

  const { commandPaletteItems, links } = useShellNavigation();

  const navigationDrawer = useNavigationDrawer();

  const handleCommandPaletteSelect = (item: CommandPaletteEntry): void => {
    commandPalette.close();

    navigate(item.value);
  };

  return (
    <UIPageSurface>
      <NavigationHeader
        onOpenCommandPalette={commandPalette.openPalette}
        onOpenNavigation={navigationDrawer.open}
      />

      <ShellCommandPalette
        items={commandPaletteItems}
        onClose={commandPalette.close}
        onQueryChange={commandPalette.setQuery}
        onSelect={handleCommandPaletteSelect}
        open={commandPalette.open}
        query={commandPalette.query}
      />

      <UINavigationDrawer onClose={navigationDrawer.close} open={navigationDrawer.isOpen}>
        <NavigationDrawer links={links} onNavigate={navigationDrawer.close} />
      </UINavigationDrawer>

      <UIPageContent>{props.children}</UIPageContent>

    </UIPageSurface>
  );
}

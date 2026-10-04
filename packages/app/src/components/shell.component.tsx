import {
  UIResponsiveNavigationDrawer,
  UIPageContent,
  UIPageSurface,
  type CommandPaletteEntry,
} from "@guesant/saberes-ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./footer.component";
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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const commandPalette = useCommandPalette();

  const { commandPaletteItems, links } = useShellNavigation();

  const handleCommandPaletteSelect = (item: CommandPaletteEntry): void => {
    commandPalette.close();

    navigate(item.value);
  };

  return (
    <UIPageSurface>
      <NavigationHeader
        links={links}
        onOpenCommandPalette={commandPalette.openPalette}
        onOpenMenu={() => setOpen(true)}
      />

      <ShellCommandPalette
        items={commandPaletteItems}
        onClose={commandPalette.close}
        onQueryChange={commandPalette.setQuery}
        onSelect={handleCommandPaletteSelect}
        open={commandPalette.open}
        query={commandPalette.query}
      />

      <UIResponsiveNavigationDrawer mobileOpen={open} onMobileClose={() => setOpen(false)}>
        <NavigationDrawer links={links} onSelect={() => setOpen(false)} />
      </UIResponsiveNavigationDrawer>

      <UIPageContent sidebarAware>{props.children}</UIPageContent>

      <Footer />
    </UIPageSurface>
  );
}

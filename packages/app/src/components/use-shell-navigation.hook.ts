import { useTranslation } from "react-i18next";
import { usePersonalWorkspaceQuery } from "../features/personal/use-personal-workspace-query.hook";
import { createShellNavigationLinks } from "./create-shell-navigation-links.function";
import { getCatalogCommandPaletteItems } from "./get-catalog-command-palette-items.function";
import { getPersonalCommandPaletteItems } from "./get-personal-command-palette-items.function";
import { useShellCatalogQuery } from "./use-shell-catalog-query.hook";

export function useShellNavigation() {
  const { t } = useTranslation();

  const workspaceQuery = usePersonalWorkspaceQuery();

  const catalog = useShellCatalogQuery();

  const links = createShellNavigationLinks(t);

  const navigationItems = links.map((link) => {
    return {
      id: link.to,
      label: link.label,
      value: link.to,
    };
  });

  const personalItems = getPersonalCommandPaletteItems(workspaceQuery.data);

  const catalogItems = getCatalogCommandPaletteItems(catalog);

  return { commandPaletteItems: [...navigationItems, ...catalogItems, ...personalItems], links };
}

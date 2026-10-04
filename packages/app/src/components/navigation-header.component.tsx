import {
  UIAppBar,
  UIHeaderBrand,
  UIHeaderNavigation,
  UIIconButton,
  UIMenuIcon,
  UIOfflineStatusChip,
  UISearchIcon,
  UIToolbar,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { NavigationButton } from "./navigation-button.component";
import type { NavigationLink } from "./navigation-link.interface";

export type NavigationHeaderProps = {
  links: NavigationLink[];
  onOpenMenu(): void;

  onOpenCommandPalette(): void;
};

export function NavigationHeader(props: NavigationHeaderProps) {
  const { t } = useTranslation();

  return (
    <UIAppBar color="primary" position="sticky">
      <UIToolbar>
        <UIIconButton
          aria-label={t("common.openMenu")}
          color="inherit"
          edge="start"
          onClick={props.onOpenMenu}
        >
          <UIMenuIcon />
        </UIIconButton>

        <UIHeaderBrand href="/">{t("brand.headerName")}</UIHeaderBrand>

        <UIIconButton
          aria-label={t("common.openCommandPalette")}
          color="inherit"
          onClick={props.onOpenCommandPalette}
        >
          <UISearchIcon />
        </UIIconButton>

        <UIHeaderNavigation>
          {props.links.map((link) => (
            <NavigationButton key={link.to} label={link.label} to={link.to} />
          ))}
        </UIHeaderNavigation>

        <UIOfflineStatusChip label={t("common.offline")} />
      </UIToolbar>
    </UIAppBar>
  );
}

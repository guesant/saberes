import {
  UIAppBar,
  UIHeaderBrand,
  UIIconButton,
  UIMenuIcon,
  UIOfflineStatusChip,
  UISearchIcon,
  UIToolbar,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type NavigationHeaderProps = {
  onOpenCommandPalette(): void;

  onOpenNavigation(): void;
};

export function NavigationHeader(props: NavigationHeaderProps) {
  const { t } = useTranslation();

  return (
    <UIAppBar color="primary">
      <UIToolbar>
        <UIIconButton
          aria-label={t("common.openMenu")}
          color="inherit"
          onClick={props.onOpenNavigation}
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

        <UIOfflineStatusChip label={t("common.offline")} />
      </UIToolbar>
    </UIAppBar>
  );
}

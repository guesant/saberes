import {
  UIAppBar,
  UIChip,
  UIHeaderBrand,
  UIHeaderNavigation,
  UIIconButton,
  UIMenuIcon,
  UIOfflineBoltIcon,
  UIToolbar,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { NavigationButton } from "./navigation-button.component";

export type NavigationHeaderProps = {
  links: Array<{ label: string; to: string }>;
  onOpenMenu: () => void;
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

        <UIHeaderNavigation>
          {props.links.map((link) => (
            <NavigationButton key={link.to} label={link.label} to={link.to} />
          ))}
        </UIHeaderNavigation>

        <UIChip icon={<UIOfflineBoltIcon />} label={t("common.offline")} size="small" />
      </UIToolbar>
    </UIAppBar>
  );
}

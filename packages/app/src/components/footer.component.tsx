import { UIFooterSurface } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <UIFooterSurface>
      {t("brand.name")} ·{t("brand.footer")}
    </UIFooterSurface>
  );
}

import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function MyStudyNoSessions() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("home.noStudySessions")}</UITypography>;
}

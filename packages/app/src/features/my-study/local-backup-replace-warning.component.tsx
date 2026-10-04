import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function LocalBackupReplaceWarning() {
  const { t } = useTranslation();

  return <UIAlert severity="warning">{t("backup.replaceWarning")}</UIAlert>;
}

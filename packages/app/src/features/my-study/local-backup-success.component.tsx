import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function LocalBackupSuccess() {
  const { t } = useTranslation();

  return <UIAlert severity="success">{t("backup.success")}</UIAlert>;
}

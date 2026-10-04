import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LocalBackupReplaceWarning } from "./local-backup-replace-warning.component";
import type { LocalBackupReplaceControlProps } from "./local-backup-replace-control-props.type";

export function LocalBackupReplaceControl(props: LocalBackupReplaceControlProps) {
  const { t } = useTranslation();

  const [replaceConfirmation, setReplaceConfirmation] = useState(false);

  const handleReplace = async (): Promise<void> => {
    if (!replaceConfirmation) {
      setReplaceConfirmation(true);

      return;
    }

    await props.onImport("replace");
  };

  return (
    <UIContentGroup variant="tight">
      {replaceConfirmation ? <LocalBackupReplaceWarning /> : null}
      <UIButton color="warning" variant="outlined" onClick={handleReplace}>
        {replaceConfirmation ? t("backup.confirmReplace") : t("backup.replace")}
      </UIButton>
    </UIContentGroup>
  );
}

import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LocalBackupReplaceControl } from "./local-backup-replace-control.component";
import type { LocalBackupPreviewProps } from "./local-backup-preview-props.type";

export function LocalBackupPreview(props: LocalBackupPreviewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h4">{t("backup.previewTitle")}</UITypography>
      <UITypography color="text.secondary">
        {t("backup.previewDescription", {
          fileName: props.pending.fileName,
          fileSize: props.pending.fileSize,
        })}
      </UITypography>
      <UITypography color="text.secondary">{t("backup.scope")}</UITypography>
      <UIInlineActions stacked>
        <UIButton
          variant="outlined"
          onClick={() => {
            return props.onImport("merge");
          }}
        >
          {t("backup.merge")}
        </UIButton>
        <LocalBackupReplaceControl onImport={props.onImport} />
        <UIButton variant="text" onClick={props.onCancel}>
          {t("backup.cancel")}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}

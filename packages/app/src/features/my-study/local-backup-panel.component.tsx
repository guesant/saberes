import {
  UIContentGroup,
  UIDownloadFileButton,
  UIFileInput,
  UIInlineActions,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LocalBackupError } from "./local-backup-error.component";
import { LocalBackupPreview } from "./local-backup-preview.component";
import { LocalBackupSuccess } from "./local-backup-success.component";
import type { LocalBackupPanelProps } from "./local-backup-panel-props.type";

export function LocalBackupPanel(props: LocalBackupPanelProps) {
  const { t } = useTranslation();

  const isBusy = props.viewModel.state === "busy";

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h3">{t("backup.title")}</UITypography>
      <UITypography color="text.secondary">{t("backup.description")}</UITypography>
      <UIInlineActions>
        <UIDownloadFileButton
          disabled={isBusy}
          fileName="saberes-progress.json"
          label={t("backup.export")}
          onDownload={props.viewModel.exportBackup}
          onError={props.viewModel.handleError}
        />
        <UIFileInput
          accept="application/json,.json"
          disabled={isBusy}
          label={t("backup.import")}
          onFile={props.viewModel.importBackup}
        />
      </UIInlineActions>
      {props.viewModel.state === "preview" && props.viewModel.pending ? (
        <LocalBackupPreview
          pending={props.viewModel.pending}
          onCancel={props.viewModel.cancelImport}
          onImport={props.viewModel.handleRestoreBackup}
        />
      ) : null}
      {props.viewModel.state === "success" ? <LocalBackupSuccess /> : null}
      {props.viewModel.error ? <LocalBackupError error={props.viewModel.error} /> : null}
    </UIContentGroup>
  );
}

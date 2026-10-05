import {
  UIContentGroup,
  UIDownloadFileButton,
  UIFileInput,
  UIInlineActions,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LocalBackupPanelState } from "./local-backup-panel-state.component";
import type { LocalBackupPanelProps } from "./local-backup-panel-props.type";

export function LocalBackupPanel(props: LocalBackupPanelProps) {
  const { t } = useTranslation();

  const isBusy = props.viewModel.state === "busy";

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h3">{t("backup.title")}</UITypography>
      <UITypography color="text.secondary">{t("backup.description")}</UITypography>
      <UITypography color="text.secondary" role="status">
        {t(`backup.states.${props.viewModel.state}`)}
      </UITypography>
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
      <LocalBackupPanelState viewModel={props.viewModel} />
    </UIContentGroup>
  );
}

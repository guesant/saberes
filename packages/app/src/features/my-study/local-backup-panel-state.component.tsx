import { LocalBackupPanelFeedback } from "./local-backup-panel-feedback.component";
import { LocalBackupPreview } from "./local-backup-preview.component";
import type { LocalBackupPanelStateProps } from "./local-backup-panel-state-props.interface";

export function LocalBackupPanelState(props: LocalBackupPanelStateProps) {
  return (
    <>
      {props.viewModel.state === "preview" && props.viewModel.pending ? (
        <LocalBackupPreview
          pending={props.viewModel.pending}
          onCancel={props.viewModel.cancelImport}
          onImport={props.viewModel.handleRestoreBackup}
        />
      ) : null}
      <LocalBackupPanelFeedback viewModel={props.viewModel} />
    </>
  );
}

import { UIGrid } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalNoteCreateDialog } from "./personal-note-create-dialog.component";
import { PersonalReferenceCreateDialog } from "./personal-reference-create-dialog.component";
import { StudyCaptureCreateDialog } from "./study-capture-create-dialog.component";
import { StudyChecklistCreateDialog } from "./study-checklist-create-dialog.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceCreationActionsProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceCreationActions(props: PersonalWorkspaceCreationActionsProps) {
  const { t } = useTranslation();

  return (
    <UIGrid columns={2}>
      <PersonalNoteCreateDialog
        onCreate={props.viewModel.createNote}
        title={t("personal.createNote")}
        triggerLabel={t("personal.createNoteAction")}
      />
      <StudyChecklistCreateDialog
        onCreate={props.viewModel.createChecklist}
        title={t("personal.createChecklist")}
        triggerLabel={t("personal.createChecklistAction")}
      />
      <StudyCaptureCreateDialog
        onCreate={props.viewModel.createCapture}
        title={t("personal.createCapture")}
        triggerLabel={t("personal.createCaptureAction")}
      />
      <PersonalReferenceCreateDialog
        onCreate={props.viewModel.createReference}
        title={t("personal.createReference")}
        triggerLabel={t("personal.createReferenceAction")}
      />
    </UIGrid>
  );
}

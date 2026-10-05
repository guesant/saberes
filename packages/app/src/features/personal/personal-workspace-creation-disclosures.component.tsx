import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalNoteCreate } from "./personal-note-create.component";
import { PersonalReferenceCreate } from "./personal-reference-create.component";
import { StudyCaptureCreate } from "./study-capture-create.component";
import { StudyChecklistCreate } from "./study-checklist-create.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceCreationDisclosuresProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceCreationDisclosures(
  props: PersonalWorkspaceCreationDisclosuresProps,
) {
  const { t } = useTranslation();

  return (
    <>
      <UIDisclosure summary={t("personal.createNote")}>
        <PersonalNoteCreate onCreate={props.viewModel.createNote} />
      </UIDisclosure>
      <UIDisclosure summary={t("personal.createChecklist")}>
        <StudyChecklistCreate onCreate={props.viewModel.createChecklist} />
      </UIDisclosure>
      <UIDisclosure summary={t("personal.createCapture")}>
        <StudyCaptureCreate onCreate={props.viewModel.createCapture} />
      </UIDisclosure>
      <UIDisclosure summary={t("personal.createReference")}>
        <PersonalReferenceCreate onCreate={props.viewModel.createReference} />
      </UIDisclosure>
    </>
  );
}

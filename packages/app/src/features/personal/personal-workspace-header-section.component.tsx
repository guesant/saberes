import { UITypography } from "@guesant/saberes-ui";
import { PersonalWorkspaceForm } from "./personal-workspace-form.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceHeaderSectionProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceHeaderSection(props: PersonalWorkspaceHeaderSectionProps) {
  return (
    <>
      <UITypography variant="overline">Conhecimento pessoal</UITypography>
      <UITypography variant="h3">Meu espaço local</UITypography>
      <UITypography color="text.secondary">
        Notas, checklists, pendências e referências ficam no dispositivo e podem ser exportados.
      </UITypography>
      <PersonalWorkspaceForm viewModel={props.viewModel} />
    </>
  );
}

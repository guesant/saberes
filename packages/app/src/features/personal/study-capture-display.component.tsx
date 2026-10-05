import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import type { StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureDisplayProps {
  capture: StudyCapture;
  onUpdateCompletion(): Promise<void>;

  onArchive(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function StudyCaptureDisplay(props: StudyCaptureDisplayProps) {
  return (
    <UIContentGroup id={`personal-capture-${props.capture.id}`} variant="content">
      <UITypography variant="h6">{props.capture.title}</UITypography>
      <UITypography color="text.secondary">{props.capture.description}</UITypography>
      <UITypography>{props.capture.contentKey ?? "Sem ContentKey"}</UITypography>
      <UITypography color="text.secondary">
        {props.capture.dueDate ? `Prazo: ${props.capture.dueDate}` : "Sem prazo"}
      </UITypography>
      <UIInlineActions wrap>
        <UIButton onClick={props.onUpdateCompletion} variant="text">
          Atualizar conclusão
        </UIButton>
        <UIButton onClick={props.onArchive} variant="text">
          Arquivar
        </UIButton>
        <UIButton onClick={props.onEdit} variant="text">
          Editar
        </UIButton>
        <UIButton onClick={props.onDelete} variant="text">
          Excluir
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}

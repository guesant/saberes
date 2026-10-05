import { getPersonalCaptureContentPath } from "./get-personal-capture-content-path.function";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import { StudyCaptureActions } from "./study-capture-actions.component";
import { StudyCaptureSummary } from "./study-capture-summary.component";
import type { PersonalRelationEndpoint, StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureDisplayProps {
  onSelect(endpoint: PersonalRelationEndpoint): void;

  selected: boolean;
  capture: StudyCapture;
  onUpdateCompletion(): Promise<void>;

  onArchive(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function StudyCaptureDisplay(props: StudyCaptureDisplayProps) {
  const contentPath = getPersonalCaptureContentPath(props.capture.contentKey);

  return (
    <>
      <PersonalEntitySelectionSurface
        ariaLabel={`Selecionar ${props.capture.title}`}
        endpoint={{ id: props.capture.id, recordType: "capture" }}
        id={`personal-capture-${props.capture.id}`}
        onSelect={props.onSelect}
        selected={props.selected}
      >
        <StudyCaptureSummary capture={props.capture} />
      </PersonalEntitySelectionSurface>
      <StudyCaptureActions
        contentPath={contentPath}
        onArchive={props.onArchive}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
        onUpdateCompletion={props.onUpdateCompletion}
        reviewPath={props.capture.contentKey ? "/revisoes" : null}
      />
    </>
  );
}

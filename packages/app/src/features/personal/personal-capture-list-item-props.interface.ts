import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCapture } from "@guesant/saberes-application";

export interface PersonalCaptureListItemProps {
  selection: PersonalEntitySelection;
  capture: StudyCapture;
  onUpdateCompletion(id: string): Promise<void>;

  onUpdateArchive(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;
}

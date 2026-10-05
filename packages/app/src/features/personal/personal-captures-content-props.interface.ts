import type { PersonalCaptureFilter } from "./personal-capture-filter.type";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalCapturesContentProps {
  selection: PersonalEntitySelection;
  workspace: PersonalWorkspace;
  filter: PersonalCaptureFilter;
  onUpdateCompletion(id: string): Promise<void>;

  onUpdateArchive(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: StudyCaptureContentInput): Promise<void>;

  onRestore(id: string): Promise<void>;
}

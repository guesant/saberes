import type { StudyCaptureContentInput } from "./study-capture-content-input.interface";
import type { StudyCapture } from "@guesant/saberes-application";

export interface StudyCaptureEditingProps {
  capture: StudyCapture;

  onSave(input: StudyCaptureContentInput): Promise<void>;

  onCancel(): void;
}

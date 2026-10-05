import type { LessonReadModel } from "@guesant/saberes-application";

export interface LessonReadySecondaryContentProps {
  data: LessonReadModel;
  sectionIndex: number | undefined;
  onSectionChange(sectionIndex: number): Promise<void>;
}

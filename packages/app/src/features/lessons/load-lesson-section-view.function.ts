import { getLessonSectionElementId } from "./get-lesson-section-element-id.function";

export type LoadLessonSectionViewInput = {
  sections: Array<Record<string, unknown>>;
  sectionIndex: number | undefined;
};

export function loadLessonSectionView(input: LoadLessonSectionViewInput): void {
  const sectionId = getLessonSectionElementId(input);

  if (!sectionId) {
    return;
  }

  document.getElementById(`section-${sectionId}`)
    ?.scrollIntoView({ block: "start" });
}

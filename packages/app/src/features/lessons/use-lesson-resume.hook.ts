import { useEffect } from "react";
import { loadLessonSectionView } from "./load-lesson-section-view.function";

export type UseLessonResumeInput = {
  sections: Array<Record<string, unknown>>;
  sectionIndex: number | undefined;
};

export function useLessonResume(input: UseLessonResumeInput): void {
  useEffect(() => {
    loadLessonSectionView(input);
  }, [input.sections, input.sectionIndex]);
}

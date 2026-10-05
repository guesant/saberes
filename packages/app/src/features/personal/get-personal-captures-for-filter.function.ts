import type { PersonalCaptureFilter } from "./personal-capture-filter.type";
import type { StudyCapture } from "@guesant/saberes-application";

export function getPersonalCapturesForFilter(
  captures: StudyCapture[],
  filter: PersonalCaptureFilter,
): StudyCapture[] {
  if (filter === "all") {
    return captures;
  }

  return captures.filter((capture) => {
    return filter === "archived" ? capture.archived : !capture.archived;
  });
}

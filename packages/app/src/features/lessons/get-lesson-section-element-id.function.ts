export type GetLessonSectionElementIdInput = {
  sections: Array<Record<string, unknown>>;
  sectionIndex: number | undefined;
};

export function getLessonSectionElementId(input: GetLessonSectionElementIdInput): string {
  if (input.sectionIndex === undefined) {
    return "";
  }

  const section = input.sections[input.sectionIndex];

  return String(section?.id || "");
}

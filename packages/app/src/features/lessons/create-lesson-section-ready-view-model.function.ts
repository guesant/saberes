import type { LessonSectionContentInput } from "./lesson-section-content-input.type";
import type { LessonSectionContentViewModel } from "./lesson-section-content.view-model";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-domain";

export function createLessonSectionReadyViewModel(
  input: LessonSectionContentInput,
  blocks: EditorialBlock[],
  knowledgeGraph?: KnowledgeGraph,
): LessonSectionContentViewModel {
  return {
    status: "ready",
    sectionId: String(input.section.id),
    title: String(input.section.title || "Teoria"),
    markdown: String(input.section.content || ""),
    blocks,
    knowledgeGraph,
  };
}

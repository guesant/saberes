import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";

export interface LessonSectionContentReadyState {
  status: "ready";
  sectionId: string;
  title: string;
  markdown: string;
  blocks: EditorialBlock[];
  knowledgeGraph?: KnowledgeGraph;
}

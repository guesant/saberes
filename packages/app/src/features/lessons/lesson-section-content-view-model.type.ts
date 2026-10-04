import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";

export type LessonSectionContentViewModel =
  | { status: "loading" }
  | { status: "error"; error: unknown; onRetry: () => Promise<void> }
  | { status: "invalid"; message: string }
  | {
      status: "ready";
      sectionId: string;
      title: string;
      markdown: string;
      blocks: EditorialBlock[];
      knowledgeGraph?: KnowledgeGraph;
    };

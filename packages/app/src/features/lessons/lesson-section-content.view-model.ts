import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-domain";

export type LessonSectionContentViewModel =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "invalid"; message: string }
  | {
      status: "ready";
      sectionId: string;
      title: string;
      markdown: string;
      blocks: EditorialBlock[];
      knowledgeGraph?: KnowledgeGraph;
    };

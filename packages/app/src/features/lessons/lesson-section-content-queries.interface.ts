import type { KnowledgeGraph, ParseEditorialBlocksResult } from "@guesant/saberes-application";

export interface LessonSectionContentQueries {
  blocks: {
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    data?: ParseEditorialBlocksResult;
  };
  graph: {
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    data?: KnowledgeGraph;
  };
}

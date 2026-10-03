import type { ParseEditorialBlocksResult } from "@guesant/saberes-application";
import type { KnowledgeGraph } from "@guesant/saberes-domain";

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

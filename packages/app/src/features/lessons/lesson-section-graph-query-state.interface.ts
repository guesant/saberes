import type { KnowledgeGraph } from "@guesant/saberes-application";

export interface LessonSectionGraphQueryState {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data?: KnowledgeGraph;
}

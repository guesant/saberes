import type { KnowledgeGraph } from "@guesant/saberes-application";

export interface LessonSectionGraphQueryState {
  isEnabled: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data?: KnowledgeGraph;
}

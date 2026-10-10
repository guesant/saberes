export interface TopicCurriculumCoverage {
  targetEditionSlug: string;
  targetStageSlug: string;
  official: boolean;
  reviewStatus: "draft" | "review" | "published" | "missing";
  canonicalMappingStatus: "draft" | "review" | "published" | "missing";
  sourceCount: number;
  sourceTitle?: string;
  sourceUrl?: string;
  sourcePage?: number;
  sourceExcerpt?: string;
  candidateQuestionCount: number;
  historicalQuestionCount: number;
  historicalOccurrenceCount: number;
  learningResourceCount: number;
  practiceResourceCount: number;
  missingRequirements: string[];
}

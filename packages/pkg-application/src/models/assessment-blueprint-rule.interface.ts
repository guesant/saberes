export interface AssessmentBlueprintRule {
  id: number | string;
  questionCount: number;
  subjectId?: number | string;
  topicId?: number | string;
  skillId?: number | string;
  difficulty?: string;
}

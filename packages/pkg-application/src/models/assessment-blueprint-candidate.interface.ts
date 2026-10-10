export interface AssessmentBlueprintCandidate {
  questionKey: string;
  canonicalQuestionId: number | string;
  subjectIds?: Array<number | string>;
  topicIds?: Array<number | string>;
  skillIds?: Array<number | string>;
  difficulty?: string;
}

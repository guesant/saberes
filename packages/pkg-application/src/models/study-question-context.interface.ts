export interface StudyQuestionContext {
  canonicalQuestionId?: number | string;
  targetEditionKey?: string;
  targetStageKey?: string;
  sourceEditionKey?: string;
  sourceStageKey?: string;
  questionContentVersion?: string;
  answerKeyVersion?: string;
  subjectIds?: Array<number | string>;
  skillIds?: Array<number | string>;
  blueprintId?: number | string;
  blueprintVersion?: string;
  ordinal?: number;
}

export interface StudyPlanRearrangementConflict {
  readonly duplicatedStepIds: string[];
  readonly hasConflict: boolean;
  readonly missingStepIds: string[];
  readonly unexpectedStepIds: string[];
}

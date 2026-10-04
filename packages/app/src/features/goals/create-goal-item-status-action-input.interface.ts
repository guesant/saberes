export interface CreateGoalItemStatusActionInput {
  hidden: boolean;

  label: string;

  onClick(): Promise<void>;
}

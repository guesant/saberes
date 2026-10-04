export interface GoalItemStatusButtonProps {
  disabled: boolean;

  hidden: boolean;

  label: string;

  onClick(): Promise<void>;
}

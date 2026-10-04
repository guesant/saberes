import { ContentErrorState } from "../../components/content-error-state.component";

export interface GoalSaveErrorProps {
  error: Error | null;
}

export function GoalSaveError(props: GoalSaveErrorProps) {
  if (!props.error) {
    return null;
  }

  return <ContentErrorState error={props.error} />;
}

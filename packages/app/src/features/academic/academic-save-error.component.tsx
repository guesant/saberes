import { ContentErrorState } from "../../components/content-error-state.component";

export interface AcademicSaveErrorProps {
  error: Error | null;
}

export function AcademicSaveError(props: AcademicSaveErrorProps) {
  if (!props.error) {
    return null;
  }

  return <ContentErrorState error={props.error} />;
}

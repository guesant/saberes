import { ContentErrorState } from "../../components/content-error-state.component";

export type MyStudyProgressErrorProps = {
  error: Error;
  onRetry: () => Promise<void>;
  label: string;
};

export function MyStudyProgressError(props: MyStudyProgressErrorProps) {
  return <ContentErrorState error={props.error} label={props.label} onRetry={props.onRetry} />;
}

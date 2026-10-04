import { UIContentGroup } from "@guesant/saberes-ui";
import { ErrorMessage } from "./error-message.component";
import { RetryButton } from "./retry-button.component";

type ContentErrorDetailsProps = {
  message: string;
  onRetry?: () => void;
};

export function ContentErrorDetails(props: ContentErrorDetailsProps) {
  return (
    <UIContentGroup variant="tight">
      <ErrorMessage message={props.message} />

      <RetryButton onRetry={props.onRetry} />
    </UIContentGroup>
  );
}

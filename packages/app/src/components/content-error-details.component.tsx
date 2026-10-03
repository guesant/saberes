import { Stack } from "@guesant/saberes-ui";
import { ErrorMessage } from "./error-message.component";
import { RetryButton } from "./retry-button.component";

type ContentErrorDetailsProps = {
  message: string;
  onRetry?: () => void;
};

export function ContentErrorDetails(props: ContentErrorDetailsProps) {
  return (
    <Stack spacing={1}>
      <ErrorMessage message={props.message} />

      <RetryButton onRetry={props.onRetry} />
    </Stack>
  );
}

import { Box } from "@guesant/saberes-ui";

export type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return <Box component="code">{props.message}</Box>;
}

import { UICodeText } from "@guesant/saberes-ui";

export type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return <UICodeText>{props.message}</UICodeText>;
}

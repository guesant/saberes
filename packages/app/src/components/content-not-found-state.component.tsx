import { Alert } from "@guesant/saberes-ui";

export type ContentNotFoundStateProps = {
  label: string;
};

export function ContentNotFoundState(props: ContentNotFoundStateProps) {
  return <Alert severity="info">{props.label}</Alert>;
}

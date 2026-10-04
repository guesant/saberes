import { UIAlert } from "@guesant/saberes-ui";

export type ContentNotFoundStateProps = {
  label: string;
};

export function ContentNotFoundState(props: ContentNotFoundStateProps) {
  return <UIAlert severity="info">{props.label}</UIAlert>;
}

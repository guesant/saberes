import { UITypography } from "@guesant/saberes-ui";

export interface PersonalReferenceLocalSourceProps {
  source: string;
}

export function PersonalReferenceLocalSource(props: PersonalReferenceLocalSourceProps) {
  return <UITypography color="text.secondary">{props.source}</UITypography>;
}

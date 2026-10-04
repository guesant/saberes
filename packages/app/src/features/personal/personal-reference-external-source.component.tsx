import { UILink } from "@guesant/saberes-ui";

export interface PersonalReferenceExternalSourceProps {
  source: string;
}

export function PersonalReferenceExternalSource(props: PersonalReferenceExternalSourceProps) {
  return (
    <UILink href={props.source} rel="noreferrer" target="_blank">
      {props.source}
    </UILink>
  );
}

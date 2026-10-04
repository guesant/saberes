import { PersonalReferenceExternalSource } from "./personal-reference-external-source.component";
import { PersonalReferenceLocalSource } from "./personal-reference-local-source.component";
import type { PersonalReference } from "@guesant/saberes-application";

export interface PersonalReferenceSourceProps {
  reference: PersonalReference;
}

export function PersonalReferenceSource(props: PersonalReferenceSourceProps) {
  if (props.reference.type === "link") {
    return <PersonalReferenceExternalSource source={props.reference.source} />;
  }

  return <PersonalReferenceLocalSource source={props.reference.source} />;
}

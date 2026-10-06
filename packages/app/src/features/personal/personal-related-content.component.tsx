import { ContentReferenceLabel } from "../../components/content-reference-label.component";

export interface PersonalRelatedContentProps {
  value: string;
}

export function PersonalRelatedContent(props: PersonalRelatedContentProps) {
  return (
    <ContentReferenceLabel value={props.value} />
  );
}

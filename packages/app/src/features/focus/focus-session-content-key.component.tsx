import { ContentReferenceLabel } from "../../components/content-reference-label.component";

export interface FocusSessionContentKeyProps {
  contentKey: string;
}

export function FocusSessionContentKey(props: FocusSessionContentKeyProps) {
  return <ContentReferenceLabel value={props.contentKey} />;
}

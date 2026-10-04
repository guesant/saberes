import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { TopicRelatedLinkProps } from "./topic-related-link-props.type";

export function TopicRelatedLink(props: TopicRelatedLinkProps) {
  return (
    <UIListItemButton component={Link} to={`/topicos/${String(props.topic.slug)}`}>
      <UIListItemText
        primary={String(props.topic.name)}
        secondary={String(props.topic.description || props.topic.relation_type || "")}
      />
    </UIListItemButton>
  );
}

import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getTopicResourceDescription } from "./get-topic-resource-description.function";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicResourceLinkProps {
  resource: TopicResourceReadModel;
}

export function TopicResourceLink(props: TopicResourceLinkProps) {
  const { t } = useTranslation();

  const { resource } = props;

  const description = getTopicResourceDescription(resource, t);

  return (
    <UIListItemButton component="a" href={resource.url}>
      <UIListItemText primary={resource.title} secondary={description} />
    </UIListItemButton>
  );
}

import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getTopicResourceAvailabilityKey } from "./get-topic-resource-availability-key.function";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicResourceLinkProps {
  resource: TopicResourceReadModel;
}

export function TopicResourceLink(props: TopicResourceLinkProps) {
  const { t } = useTranslation();

  const { resource } = props;

  const availability = t(getTopicResourceAvailabilityKey(resource.isExternal));

  const description = [resource.description, resource.kind, resource.provider, availability].filter(Boolean)
    .join(" · ");

  return (
    <UIListItemButton component="a" href={resource.url}>
      <UIListItemText primary={resource.title} secondary={description} />
    </UIListItemButton>
  );
}

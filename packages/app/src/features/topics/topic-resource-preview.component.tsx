import { UIContentGroup, UIList } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicEmptySection } from "./topic-empty-section.component";
import { TopicMoreResources } from "./topic-more-resources.component";
import { TopicResourceLink } from "./topic-resource-link.component";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicResourcePreviewProps {
  resources: TopicResourceReadModel[];
}

export function TopicResourcePreview(props: TopicResourcePreviewProps) {
  const { t } = useTranslation();

  if (!props.resources.length) {
    return <TopicEmptySection label={t("discovery.noMaterials")} />;
  }

  return (
    <UIContentGroup variant="list">
      <UIList>{props.resources.slice(0, 3)
        .map((resource) => { return <TopicResourceLink key={resource.id} resource={resource} />; })}</UIList>
      {props.resources.length > 3 && <TopicMoreResources resources={props.resources.slice(3)} />}
    </UIContentGroup>
  );
}

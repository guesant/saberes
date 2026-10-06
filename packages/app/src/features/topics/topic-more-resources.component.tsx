import { UIDisclosure, UIList } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicResourceLink } from "./topic-resource-link.component";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicMoreResourcesProps {
  resources: TopicResourceReadModel[];
}

export function TopicMoreResources(props: TopicMoreResourcesProps) {
  const { t } = useTranslation();

  return (
    <UIDisclosure summary={t("discovery.moreMaterials", { count: props.resources.length })}>
      <UIList>{props.resources.map((resource) => { return <TopicResourceLink key={resource.id} resource={resource} />; })}</UIList>
    </UIDisclosure>
  );
}

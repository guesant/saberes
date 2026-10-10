import { getTopicResourceAvailabilityKey } from "./get-topic-resource-availability-key.function";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export type EditorialTranslator = (key: string) => string;

export function getTopicResourceDescription(
  resource: TopicResourceReadModel,
  translate: EditorialTranslator,
): string {
  const labels = [
    resource.description,
    resource.kind,
    resource.provider,
    translate(`editorial.availability.${resource.availabilityMode}`),
    translate(`editorial.status.${resource.editorialStatus}`),
    translate(`editorial.status.${resource.relationStatus}`),
    translate(`editorial.relevance.${resource.relevanceStatus}`),
    translate(`editorial.accessibility.${resource.accessibilityStatus}`),
    translate(`editorial.reuse.${resource.reuseStatus}`),
    resource.licenseName,
    resource.attribution,
    resource.rightsNote,
    resource.relationNote,
    resource.editorialNote,
    translate(getTopicResourceAvailabilityKey(resource.isExternal)),
  ];

  return [...new Set(labels.filter(Boolean))]
    .join(" · ");
}

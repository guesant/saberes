import type { TopicReadModel } from "@guesant/saberes-application";

export interface TopicNavigationDisclosureProps {
  childrenTopics: TopicReadModel["children"];
  prerequisites: TopicReadModel["prerequisites"];
}

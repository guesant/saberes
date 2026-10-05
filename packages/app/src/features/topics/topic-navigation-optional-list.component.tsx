import { TopicNavigationList } from "./topic-navigation-list.component";
import type { TopicNavigationOptionalListProps } from "./topic-navigation-optional-list-props.type";

export function TopicNavigationOptionalList(props: TopicNavigationOptionalListProps) {
  if (!props.topics.length) {
    return null;
  }

  return <TopicNavigationList title={props.title} topics={props.topics} />;
}

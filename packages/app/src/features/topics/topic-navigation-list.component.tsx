import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { TopicRelatedLink } from "./topic-related-link.component";
import type { TopicNavigationListProps } from "./topic-navigation-list-props.type";

export function TopicNavigationList(props: TopicNavigationListProps) {
  return (
    <UIContentGroup variant="list">
      <UITypography variant="h5">{props.title}</UITypography>
      <UIList>
        {props.topics.map((topic) => {
          return <TopicRelatedLink key={String(topic.slug)} topic={topic} />;
        })}
      </UIList>
    </UIContentGroup>
  );
}

import { UIContentGroup, UIFocusedContent } from "@guesant/saberes-ui";
import { TopicHeader } from "./topic-header.component";
import { TopicLessonList } from "./topic-lesson-list.component";
import { TopicNavigationDisclosure } from "./topic-navigation-disclosure.component";
import { TopicQuestionList } from "./topic-question-list.component";
import { TopicRelatedDisclosure } from "./topic-related-disclosure.component";
import { TopicResourceList } from "./topic-resource-list.component";
import type { TopicReadyViewProps } from "./topic-ready-view-props.type";

export function TopicReadyView(props: TopicReadyViewProps) {
  return (
    <UIFocusedContent><UIContentGroup variant="section">
      <TopicHeader topic={props.data.topic} />
      <TopicLessonList lessons={props.data.lessons} />
      <TopicQuestionList questions={props.data.questions} />
      <TopicResourceList resources={props.data.resources} />
      <TopicNavigationDisclosure
        childrenTopics={props.data.children}
        prerequisites={props.data.prerequisites}
      />

      <TopicRelatedDisclosure topics={props.data.related} />
    </UIContentGroup></UIFocusedContent>
  );
}

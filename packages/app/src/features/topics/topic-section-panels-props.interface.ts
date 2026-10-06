import type { TopicLessonReadModel, TopicQuestionReadModel, TopicResourceReadModel } from "@guesant/saberes-application";

export interface TopicSectionPanelsProps {
  activeSection: number;
  lessons: TopicLessonReadModel[];
  questions: TopicQuestionReadModel[];
  resources: TopicResourceReadModel[];
}

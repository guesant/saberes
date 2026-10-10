import type { TopicCurriculumCoverage } from "./topic-curriculum-coverage.interface";
import type { TopicDetailsReadModel } from "./topic-details-read-model.interface";
import type { TopicLessonReadModel } from "./topic-lesson-read-model.interface";
import type { TopicNavigationReadModel } from "./topic-navigation-read-model.interface";
import type { TopicQuestionReadModel } from "./topic-question-read-model.interface";
import type { TopicResourceReadModel } from "./topic-resource-read-model.interface";

export interface TopicReadModel {
  topic: TopicDetailsReadModel;
  children: TopicNavigationReadModel[];
  lessons: TopicLessonReadModel[];
  prerequisites: TopicNavigationReadModel[];
  questions: TopicQuestionReadModel[];
  related: TopicNavigationReadModel[];
  resources: TopicResourceReadModel[];
  curriculum?: TopicCurriculumCoverage;
}

import type { QuestionContextReadModel } from "./question-context-read-model.interface";
import type { QuestionDetailsReadModel } from "./question-details-read-model.interface";
import type { QuestionOptionReadModel } from "./question-option-read-model.interface";
import type { QuestionPartReadModel } from "./question-part-read-model.interface";
import type { QuestionTopicReadModel } from "./question-topic-read-model.interface";
import type { TopicQuestionReadModel } from "./topic-question-read-model.interface";

export interface QuestionReadModel {
  question: QuestionDetailsReadModel;
  options: QuestionOptionReadModel[];
  parts: QuestionPartReadModel[];
  topics: QuestionTopicReadModel[];
  related: TopicQuestionReadModel[];
  contexts?: QuestionContextReadModel[];
}

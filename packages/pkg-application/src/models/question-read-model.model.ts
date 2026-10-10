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
  assets?: Array<{
    id: number;
    path: string;
    mediaType: string;
    altText: string;
    position: number;
  }>;
  pdfPages?: Array<{
    occurrenceId: number;
    path: string;
    page: number;
    year: number;
    editionSlug: string;
    paperVersionCode: string | null;
    paperVersionName: string | null;
    paperName: string;
  }>;
  solutions?: Array<{
    id: number;
    title: string;
    content: string;
    position: number;
    editorialStatus?: "draft" | "review" | "published";
    editorialVersion?: string | null;
    authorship?: string | null;
    sourceUrl?: string | null;
    sourceTitle?: string | null;
  }>;
  hints?: Array<{ id: number; content: string; position: number }>;
  skills?: Array<{ id: number; slug: string; name: string; relationType: string }>;
  optionExplanations?: Array<{ optionId: number; content: string; diagnosisCode: string | null }>;
  subjectIds?: number[];
}

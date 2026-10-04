import type {
  Attempt,
  CatalogCard,
  CatalogReadModel,
  ReviewTarget,
  StudyRecord,
  StudySession,
} from "@guesant/saberes-application";

export interface MyStudyReadModel {
  attempts: Attempt[];
  catalog: CatalogReadModel;
  reviews: ReviewTarget[];
  sessions: StudySession[];
  streak: StudyRecord | undefined;
  achievements: StudyRecord[];
  dailyQuestion: CatalogCard | null;
  topicMastery: StudyRecord[];
  savedLessons: CatalogCard[];
  savedQuestions: CatalogCard[];
}
